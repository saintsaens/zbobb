import { useEffect } from "react";
import type { Article } from "../components/LinksManager";

export type SelectedPosition = {
  sectionIndex: number;
  linkIndex: number;
};

interface Props {
  articles: Article[];
  selectedPos: SelectedPosition;
  setSelectedPos: React.Dispatch<React.SetStateAction<SelectedPosition>>;
  editingLink?: SelectedPosition | null; // skip navigation while editing
  onEnter?: (sectionIndex: number, linkIndex: number) => void;
}

export default function useArrowNavigation({
  articles,
  selectedPos,
  setSelectedPos,
  editingLink,
  onEnter,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!articles.length) return;

      // If currently editing, do not move selection
      if (editingLink) return;

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
              return {
                sectionIndex: prev.sectionIndex - 1,
                linkIndex: prevSection.links.length - 1,
              };
            }
          }

          return prev;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        onEnter?.(selectedPos.sectionIndex, selectedPos.linkIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [articles, selectedPos, setSelectedPos, editingLink, onEnter]);
}