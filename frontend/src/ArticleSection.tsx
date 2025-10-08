import { useEffect, useState } from "react";
import RenderContext from "./RenderContext";
import { Grid, Typography, Divider } from "@mui/material";
import LinkedPageTitle from "./LinkedPageTitle";

type Hyperlink = {
  href: string;
  highlight: string;
  context: string;
};

type ArticleLinks = {
  title: string;
  links: Hyperlink[];
};

type ArticleSectionProps = {
  id: number;
  isSelected: boolean;
};

export default function ArticleSection({ id, isSelected }: ArticleSectionProps) {
  const [articleLinks, setArticleLinks] = useState<ArticleLinks | null>(null);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState(0);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/articles/${id}/links`);
        if (!res.ok) throw new Error("Failed to fetch links");
        const data: ArticleLinks = await res.json();
        setArticleLinks(data);
      } catch (err) {
        console.error("Error fetching links:", err);
      }
    };
    fetchLinks();
  }, [id]);

  // Only handle keyboard when this section is active
  useEffect(() => {
    if (!isSelected || !articleLinks) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setSelectedLinkIndex((prev) =>
          prev < articleLinks.links.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        setSelectedLinkIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, articleLinks]);

  if (!articleLinks) return null;

  return (
    <div
      style={{
        border: isSelected ? "1px #1976d2" : "1px #ccc",
        backgroundColor: isSelected ? "#f8f9fa" : "transparent",
        transition: "background-color 0.1s ease",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {articleLinks.title}
      </Typography>
        {articleLinks.links.map((item, index) => (
          <Grid
            container
            spacing={1}
            key={index}
            style={{
              backgroundColor:
                isSelected && selectedLinkIndex === index
                  ? "#e3f2fd"
                  : "transparent",
              transition: "background-color 0.1s ease",
            }}
          >
            <Grid size={4}>
              <Typography>
                <RenderContext
                  context={item.context ?? ""}
                  highlight={item.highlight ?? ""}
                />
              </Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{item.href}</Typography>
              <LinkedPageTitle url={item.href} />
            </Grid>
          </Grid>
        ))}
      <Divider style={{ margin: "20px 0" }} />
    </div>
  );
}