import { useEffect, useState, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter links within each article
  const filteredArticles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return articles;

    return articles
      .map((article) => {
        const filteredLinks = article.links.filter(
          (link) =>
            link.href.toLowerCase().includes(term) ||
            link.highlight.toLowerCase().includes(term) ||
            link.context.toLowerCase().includes(term)
        );
        return filteredLinks.length > 0
          ? { ...article, links: filteredLinks }
          : null;
      })
      .filter(Boolean) as Article[];
  }, [articles, searchTerm]);

  // Reset selection when filtered articles change
  useEffect(() => {
    setSelectedPos({ sectionIndex: 0, linkIndex: 0 });
  }, [filteredArticles]);

  // Keyboard navigation
  useArrowNavigation(filteredArticles, selectedPos, setSelectedPos);

  if (!filteredArticles.length) return <p>Fetching articles…</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search…"
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {filteredArticles.map((article, index) => (
        <ArticleSection
          key={article.id}
          {...article}
          isSelected={selectedPos.sectionIndex === index}
          selectedLinkIndex={selectedPos.sectionIndex === index ? selectedPos.linkIndex : -1}
        />
      ))}
    </div>
  );
}