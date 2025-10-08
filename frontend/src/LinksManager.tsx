import { useEffect, useState } from "react";
import ArticleSection from "./ArticleSection";
import useArrowNavigation from "./useArrowNavigation";
import type { SelectedPosition } from "./useArrowNavigation";

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
  useArrowNavigation(articles, selectedPos, setSelectedPos);

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