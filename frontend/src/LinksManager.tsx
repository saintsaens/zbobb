import { useEffect, useState } from "react";
import ArticleSection from "./ArticleSection";

type Article = {
  id: number;
  title: string;
  url: string;
  body: string;
};

export default function LinksManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/articles/");
        if (!res.ok) throw new Error("Failed to fetch links");
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching links:", err);
      }
    };
    fetchLinks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!articles.length) return;

      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < articles.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [articles]);

  if (!articles.length) return null;

  return (
    <>
      {articles.map((article, index) => (
        <ArticleSection
          key={article.id}
          id={article.id}
          isSelected={index === selectedIndex}
        />
      ))}
    </>
  );
}