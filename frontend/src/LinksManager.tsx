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

  if (!articles.length) return null;

  return (
    <>
      {articles.map((article) => (
        <ArticleSection id={article.id} />
      ))}
    </>
  );
}