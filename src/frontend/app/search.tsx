"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const articles = [
    {
      title: "bli",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      title: "bla",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      title: "blo",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.body.toLowerCase().includes(search.toLowerCase())
  );

  const highlight = (text: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <mark key={idx} style={{ backgroundColor: "#ffeaa7" }}>{part}</mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div>
      <main>
        {/* Full-width fixed search bar */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            padding: "12px",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "16px",
              width: "100%",
              fontSize: "1.25rem",
              borderRadius: "0",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Articles take full width and left-aligned */}
        <div style={{ marginTop: "24px", width: "100%" }}>
          {filteredArticles.map((article) => (
            <article
              key={article.title}
              style={{
                padding: "16px",
                marginBottom: "16px",
                borderBottom: "1px solid #ddd",
                width: "100%",
              }}
            >
              <h2>{highlight(article.title)}</h2>
              <p>{highlight(article.body)}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}