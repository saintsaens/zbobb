import { useState, useEffect, useRef } from "react";

export interface UrlItem {
  articleIndex: number;
  urlIndex: number;
  url: string;
}

interface Article {
  title: string;
  items: {
    context: string;
    highlight: string;
    href: string;
  }[];
}

export default function useArrowNavigation(
  urlItems: UrlItem[],
  articles: Article[],
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>
) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (editingIndex !== null) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % urlItems.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + urlItems.length) % urlItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = urlItems[selectedIndex];
      setEditingIndex(selectedIndex);
      setEditValue(articles[item.articleIndex].items[item.urlIndex].href);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingIndex !== null) {
      const item = urlItems[editingIndex];
      const newArticles = [...articles];
      newArticles[item.articleIndex].items[item.urlIndex].href = editValue;
      setArticles(newArticles);
      setEditingIndex(null);
    } else if (e.key === "Escape") {
      setEditingIndex(null); // cancel edit
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, editingIndex, urlItems]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedIndex]);

  return {
    selectedIndex,
    editingIndex,
    editValue,
    setEditValue,
    handleEditKeyDown,
    itemRefs,
  };
}