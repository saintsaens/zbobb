import { useEffect, useRef, useState } from "react";
import { Grid, Typography, Divider, TextField } from "@mui/material";
import RenderContext from "./RenderContext";
import LinkedPageTitle from "./LinkedPageTitle";
import type { Article } from "./LinksManager";

type ArticleSectionProps = Article & {
  isSelected: boolean;
  selectedLinkIndex: number;
  editingLink: number | null; // index of link being edited
  onSaveEdit: (newHref: string | null) => void;
};

export default function ArticleSection({
  title,
  links,
  isSelected,
  selectedLinkIndex,
  editingLink,
  onSaveEdit,
}: ArticleSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempHref, setTempHref] = useState("");

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingLink !== null && inputRef.current) {
      setTempHref(links[editingLink].href);
      inputRef.current.focus();
    }
  }, [editingLink, links]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSaveEdit(tempHref); // Save edit
    } else if (e.key === "Escape") {
      e.preventDefault();
      onSaveEdit(null); // Cancel edit
    }
  };

  return (
    <div
      style={{
        border: isSelected ? "1px #1976d2" : "1px #ccc",
        backgroundColor: isSelected ? "#f8f9fa" : "transparent",
        transition: "background-color 0.1s ease",
        padding: 5,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {links.map((link, index) => (
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
            padding: "2px 0",
          }}
        >
          {/* Context / Highlight column */}
          <Grid size={4}>
            <Typography>
              <RenderContext context={link.context} highlight={link.highlight} />
            </Typography>
          </Grid>

          {/* Href column */}
          <Grid size={8}>
            {editingLink === index ? (
              <TextField
                fullWidth
                size="small"
                value={tempHref}
                onChange={(e) => setTempHref(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => onSaveEdit(tempHref)}
                inputRef={inputRef}
              />
            ) : (
              <>
                <Typography>{link.href}</Typography>
                <LinkedPageTitle url={link.href} />
              </>
            )}
          </Grid>
        </Grid>
      ))}

      <Divider style={{ margin: "20px 0" }} />
    </div>
  );
}