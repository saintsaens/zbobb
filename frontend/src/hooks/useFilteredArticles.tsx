import { useMemo } from "react";
import type { Article } from "./../components/LinksManager";

type Props = {
  articles: Article[];
  searchTerm: string;
};

export default function useFilteredArticles({ articles, searchTerm }: Props) {
  return useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return articles;

    return articles
      .map((article) => {
        const filteredLinks = article.links.filter(
          (link) =>
            link.href.toLowerCase().includes(term) ||
            link.highlight.toLowerCase().includes(term) ||
            link.context.toLowerCase().includes(term) ||
            article.title.toLowerCase().includes(term) ||
            article.url.toLowerCase().includes(term)
        );
        return filteredLinks.length > 0
          ? { ...article, links: filteredLinks }
          : null;
      })
      .filter(Boolean) as Article[];
  }, [articles, searchTerm]);
}
