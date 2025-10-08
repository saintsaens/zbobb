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
};

export default function ArticleSection({ id }: ArticleSectionProps) {
    const [articleLinks, setArticleLinks] = useState<ArticleLinks | null>(null);

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

    if (!articleLinks) return null;

    return (
        <>
            <Typography variant="h5" gutterBottom>
                {articleLinks.title}
            </Typography>
            <Grid container spacing={1}>
                {articleLinks.links.map((item) => (
                    <>
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
                    </>
                ))}
            </Grid>
            <Divider style={{ margin: '20px 0' }} />
        </>
    );
}