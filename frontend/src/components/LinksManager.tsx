import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchArticles, saveEdit, startEdit, cancelEdit } from "../store/slices/articlesSlice";
import type { RootState, AppDispatch } from "../store";

import ArticleSection from "./ArticleSection";
import SearchBar from "./SearchBar";

import useArrowNavigation from "../hooks/useArrowNavigation";
import useFilteredArticles from "../hooks/useFilteredArticles";

import type { SelectedPosition } from "../hooks/useArrowNavigation";

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
  const dispatch = useDispatch<AppDispatch>();

  const { items: articles, loading, error } = useSelector((state: RootState) => state.articles);
  const editingLink = useSelector((state: RootState) => state.articles.editingLink);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPos, setSelectedPos] = useState<SelectedPosition>({
    sectionIndex: 0,
    linkIndex: 0,
  });

  // Filter links by search
  const filteredArticles = useFilteredArticles({ articles, searchTerm });

  // Reset selection when filtered articles change
  useEffect(() => {
    setSelectedPos({ sectionIndex: 0, linkIndex: 0 });
  }, [filteredArticles]);

  // Keyboard navigation
  useArrowNavigation({
    articles: filteredArticles,
    selectedPos,
    setSelectedPos,
    editingLink,
    onEnter: (sectionIndex, linkIndex) => {
      dispatch(startEdit({ sectionIndex, linkIndex }));
    },
  });


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!filteredArticles.length) return <p>Nothing.</p>;

  return (
    <div style={{ padding: 5 }}>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {filteredArticles.map((article, index) => (
        <ArticleSection
          key={article.id}
          {...article}
          isSelected={selectedPos.sectionIndex === index}
          selectedLinkIndex={selectedPos.sectionIndex === index ? selectedPos.linkIndex : -1}
          editingLink={
            editingLink?.sectionIndex === index ? editingLink.linkIndex : null
          }
          onSaveEdit={(newHref: string | null) => {
            if (newHref === null) {
              dispatch(cancelEdit());
            } else {
              dispatch(saveEdit({
                sectionIndex: index,
                linkIndex: editingLink!.linkIndex,
                newHref
              }));
            }
          }}
        />
      ))}
    </div>
  );
}