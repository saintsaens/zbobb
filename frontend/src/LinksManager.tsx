import { useEffect, useState } from "react";
import RenderContext from "./RenderContext";
import { Grid, Typography } from "@mui/material";
import LinkedPageTitle from "./LinkedPageTitle";

type Link = {
  href: string;
  highlight?: string;
  context?: string;
};

type ArticleLinks = {
  title: string;
  links: Link[];
};

export default function LinksManager() {
  const [articleData, setArticleData] = useState<ArticleLinks | null>(null);


  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/articles/4405773350036/links");
        if (!res.ok) throw new Error("Failed to fetch links");
        const data: ArticleLinks = await res.json();
        setArticleData(data);
      } catch (err) {
        console.error("Error fetching links:", err);
      }
    };
    fetchLinks();
  }, []);

  if (!articleData) return null;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {articleData.title}
      </Typography>

      <Grid container spacing={2}>
        {articleData.links.map((item) => (
          <>
            <Grid size={4}>
              <RenderContext
                context={item.context ?? ""}
                highlight={item.highlight ?? ""}
              />
            </Grid>
            <Grid size={8}>
              {item.href}
              <LinkedPageTitle url={item.href} />
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
}