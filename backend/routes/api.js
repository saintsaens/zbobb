import { Router } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { decodeZendeskHtml } from "../utils.js";
import { JSDOM } from "jsdom";

dotenv.config();

const router = Router();
const { ZENDESK_SUBDOMAIN, ZENDESK_EMAIL, ZENDESK_TOKEN } = process.env;

// Preconfigure Axios instance for Zendesk API
const zendeskApi = axios.create({
  baseURL: `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/help_center`,
  headers: {
    Authorization:
      "Basic " +
      Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_TOKEN}`).toString("base64"),
    "Content-Type": "application/json",
  },
});

// Fetch first 10 articles
router.get("/articles", async (req, res) => {
  try {
    const { data } = await zendeskApi.get("/articles.json", {
      params: { per_page: 10 },
    });

    const articles = data.articles.map((a) => {
      const body = decodeZendeskHtml(a.body);

      // Extract links from HTML
      const dom = new JSDOM(body);
      const links = [...dom.window.document.querySelectorAll("a")].map((link) => {
        const highlight = link.textContent.trim();
        const href = link.href;

        let context = "";
        const parentText = link.closest("p, li, div")?.textContent || "";
        if (parentText) {
          const sentences = parentText.split(/(?<=[.!?])\s+/);
          context = sentences.find((s) => s.includes(highlight)) || parentText.trim();
        }

        return { href, highlight, context: context.trim() };
      });

      return {
        id: a.id,
        title: a.title,
        url: a.html_url,
        body,
        links,
      };
    });

    res.json(articles);
  } catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    res.status(status).json({ error: "Failed to fetch articles", details });
  }
});

// Fetch a single article by ID, including links
router.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await zendeskApi.get(`/articles/${id}.json`);

    const articleData = data.article;
    const body = decodeZendeskHtml(articleData.body);

    // Extract links
    const dom = new JSDOM(body);
    const links = [...dom.window.document.querySelectorAll("a")].map((a) => {
      const highlight = a.textContent.trim();
      const href = a.href;

      let context = "";
      const parentText = a.closest("p, li, div")?.textContent || "";
      if (parentText) {
        const sentences = parentText.split(/(?<=[.!?])\s+/);
        context = sentences.find((s) => s.includes(highlight)) || parentText.trim();
      }

      return { href, highlight, context: context.trim() };
    });

    res.json({
      id: articleData.id,
      title: articleData.title,
      url: articleData.html_url,
      body,
      links,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    res.status(status).json({ error: "Failed to fetch article", details });
  }
});

// Update a link within an article's body
router.put("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentHref, newHref, context, highlight } = req.body;

    if (!currentHref || !newHref) {
      return res
        .status(400)
        .json({ error: "Missing required fields: currentHref and newHref" });
    }

    // Step 1: Fetch current English translation
    const { data } = await zendeskApi.get(
      `/articles/${id}/translations/en-us.json`
    );
    const translation = data.translation;
    let body = translation.body;

    // Step 2: Parse the HTML and find the link to update
    const dom = new JSDOM(body);
    const document = dom.window.document;
    const link = [...document.querySelectorAll("a")].find((a) => {
      // Check href match first
      if (a.href !== currentHref) return false;

      // Check highlight (link text)
      if (highlight && a.textContent.trim() !== highlight.trim()) return false;

      // Check context (surrounding sentence/paragraph)
      if (context) {
        const parent = a.closest("p, li, div");
        if (!parent) return false;
        if (parent.textContent.trim() !== context.trim()) return false;
      }

      return true;
    });

    if (!link) {
      return res
        .status(404)
        .json({ error: `No link found with href: ${currentHref}` });
    }

    // Step 3: Update the href
    link.href = newHref;

    const updatedBody = document.body.innerHTML;

    // Step 4: Send updated translation back to Zendesk
    const response = await zendeskApi.put(
      `/articles/${id}/translations/en-us.json`,
      {
        translation: {
          title: translation.title,
          body: updatedBody,
        },
      }
    );

    res.json({
      message: "Link updated successfully",
      updatedHref: newHref,
      translation: response.data.translation,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    res.status(status).json({ error: "Failed to update link", details });
  }
});

export default router;
