import { useRef, useEffect } from "react";
import { Grid, Typography, Divider } from "@mui/material";
import RenderContext from "./RenderContext";
import LinkedPageTitle from "./LinkedPageTitle";

type Hyperlink = {
  href: string;
  highlight: string;
  context: string;
};

type ArticleSectionProps = {
  id: number;
  title: string;
  url: string;
  body: string;
  links: Hyperlink[];
  isSelected: boolean;
  selectedLinkIndex: number;
};

export default function ArticleSection({
  title,
  links,
  isSelected,
  selectedLinkIndex,
}: ArticleSectionProps) {
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isSelected && selectedLinkIndex >= 0) {
      const el = linkRefs.current[selectedLinkIndex];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [isSelected, selectedLinkIndex]);

  return (
    <div
      style={{
        border: isSelected ? "1px #1976d2" : "1px #ccc",
        backgroundColor: isSelected ? "#f8f9fa" : "transparent",
        transition: "background-color 0.1s ease",
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
          ref={(el) => { linkRefs.current[index] = el; }}
          style={{
            backgroundColor: isSelected && selectedLinkIndex === index ? "#e3f2fd" : "transparent",
            transition: "background-color 0.1s ease",
            padding: "5px",
          }}
        >
          <Grid size={4}>
            <Typography>
              <RenderContext context={link.context} highlight={link.highlight} />
            </Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{link.href}</Typography>
            <LinkedPageTitle url={link.href} />
          </Grid>
        </Grid>
      ))}
      <Divider style={{ margin: "20px 0" }} />
    </div>
  );
}