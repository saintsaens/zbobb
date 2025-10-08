import { useEffect, useState } from "react";
import ArticleSection from "./ArticleSection";

export type Article = {
  id: number;
  title: string;
  url: string;
  body: string;
  links: {
    href: string;
    highlight: string;
    context: string;
  }[];
};

type SelectedPosition = {
  sectionIndex: number;
  linkIndex: number;
};

export default function LinksManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedPos, setSelectedPos] = useState<SelectedPosition>({
    sectionIndex: 0,
    linkIndex: 0,
  });

  // Fetch articles with links
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!articles.length) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();

        setSelectedPos((prev) => {
          const section = articles[prev.sectionIndex];
          const linkCount = section.links.length;

          if (e.key === "ArrowDown") {
            if (prev.linkIndex < linkCount - 1) {
              return { ...prev, linkIndex: prev.linkIndex + 1 };
            } else if (prev.sectionIndex < articles.length - 1) {
              return { sectionIndex: prev.sectionIndex + 1, linkIndex: 0 };
            }
          } else if (e.key === "ArrowUp") {
            if (prev.linkIndex > 0) {
              return { ...prev, linkIndex: prev.linkIndex - 1 };
            } else if (prev.sectionIndex > 0) {
              const prevSection = articles[prev.sectionIndex - 1];
              return { sectionIndex: prev.sectionIndex - 1, linkIndex: prevSection.links.length - 1 };
            }
          }

          return prev;
        });
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
          {...article}
          isSelected={selectedPos.sectionIndex === index}
          selectedLinkIndex={selectedPos.sectionIndex === index ? selectedPos.linkIndex : -1}
        />
      ))}
    </>
  );
}