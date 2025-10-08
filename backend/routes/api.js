import { Router } from "express";
import dotenv from "dotenv";
import { decodeZendeskHtml } from "../utils.js";
import { JSDOM } from "jsdom";

dotenv.config();

const router = Router();
const { ZENDESK_SUBDOMAIN, ZENDESK_EMAIL, ZENDESK_TOKEN } = process.env;

// Fetch first 10 articles
router.get("/articles", async (req, res) => {
  try {
    const url = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/help_center/articles.json?per_page=10`;

    const response = await fetch(url, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_TOKEN}`).toString("base64"),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .send({ error: "Failed to fetch articles", details: errorText });
    }

    const data = await response.json();

    const articles = data.articles.map((a) => {
      const body = decodeZendeskHtml(a.body);

      // Extract links from the body
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
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Fetch a single article by ID, including links
router.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/help_center/articles/${id}.json`;

    const response = await fetch(url, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_TOKEN}`).toString("base64"),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .send({ error: "Failed to fetch article", details: errorText });
    }

    const data = await response.json();

    const article = {
      id: data.article.id,
      title: data.article.title,
      url: data.article.html_url,
      body: decodeZendeskHtml(data.article.body),
    };

    // Extract links from the article body
    const dom = new JSDOM(article.body);
    const links = [...dom.window.document.querySelectorAll("a")].map((a) => {
      const highlight = a.textContent.trim();
      const href = a.href;

      // Find the closest text node or sentence around the link
      let context = "";
      const parentText = a.closest("p, li, div")?.textContent || "";
      if (parentText) {
        // Split into sentences and find the one containing the highlight
        const sentences = parentText.split(/(?<=[.!?])\s+/);
        context = sentences.find((s) => s.includes(highlight)) || parentText.trim();
      }

      return { href, highlight, context: context.trim() };
    });

    // Return both article data and links
    res.json({
      ...article,
      links,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;