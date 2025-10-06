import { Router } from "express";
import dotenv from "dotenv";
import { decodeZendeskHtml } from "../utils.js";
import { JSDOM } from "jsdom";

dotenv.config();

const router = Router();
const { ZENDESK_SUBDOMAIN, ZENDESK_EMAIL, ZENDESK_TOKEN } = process.env;

// Fetch first 5 articles
router.get("/articles", async (req, res) => {
  try {
    const url = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/help_center/articles.json?per_page=5`;

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

    const articles = data.articles.map((a) => ({
      id: a.id,
      title: a.title,
      url: a.html_url,
      body: decodeZendeskHtml(a.body),
    }));

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Fetch all links in a specific article
router.get("/articles/:id/links", async (req, res) => {
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
    const htmlBody = decodeZendeskHtml(data.article.body);

    // Parse HTML and extract <a> tags
    const dom = new JSDOM(htmlBody);
    const links = [...dom.window.document.querySelectorAll("a")].map((a) => ({
      href: a.href,
      text: a.textContent.trim(),
    }));

    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;