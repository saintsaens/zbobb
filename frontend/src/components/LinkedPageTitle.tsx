import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

type LinkedPageTitleProps = {
  url: string;
};

export default function LinkedPageTitle({ url }: LinkedPageTitleProps) {
  const [pageTitle, setPageTitle] = useState<string>("Loading...");

  useEffect(() => {
    const fetchTitle = async (url: string) => {
      try {
        const match = url.match(/\/articles\/(\d+)/);
        if (!match) {
          setPageTitle("Invalid URL");
          return;
        }

        const articleId = match[1];
        const res = await fetch(`http://localhost:3000/api/articles/${articleId}`);

        if (res.status === 404) {
          setPageTitle("404 Not Found");
          return;
        }

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        setPageTitle(data.title || "No title");
      } catch (err) {
        console.error("Error fetching article title:", err);
        setPageTitle("Error fetching title");
      }
    };

    fetchTitle(url);
  }, [url]);

  return (
    <Typography variant="body2" color="textSecondary">
      {pageTitle}
    </Typography>
  );
}