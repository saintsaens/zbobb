"use client";

import React from "react";
import useArrowNavigation, { UrlItem } from "./useArrowNavigation";
import { articles } from "./articlesData";
import RenderContext from "./component/RenderContext";

export default function LinksManager() {
  const urlItems: UrlItem[] = articles.flatMap((article, articleIndex) =>
    article.items.map((item, urlIndex) => ({
      articleIndex,
      urlIndex,
      url: item.link,
    }))
  );

  const {
    selectedIndex,
    editingIndex,
    editValue,
    setEditValue,
    handleEditKeyDown,
    itemRefs,
  } = useArrowNavigation(urlItems, articles, () => { }); // no-op setter

  return (
    <main style={{ width: "100%", marginTop: "24px" }}>
      {articles.map((article, articleIdx) => (
        <div key={articleIdx} style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "16px 0" }}>{article.title}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 5fr 2fr 1fr",
              gap: "0",
            }}
          >
            {article.items.map((item, urlIdx) => {
              const globalIndex = urlItems.findIndex(
                (u) =>
                  u.articleIndex === articleIdx && u.urlIndex === urlIdx
              );
              const isSelected = selectedIndex === globalIndex;
              const isEditing = editingIndex === globalIndex;

              return (
                <React.Fragment key={`${articleIdx}-${urlIdx}`}>
                  {/* Context */}
                  <div
                    ref={(el) => (itemRefs.current[globalIndex] = el)}
                    style={{
                      padding: "8px",
                      backgroundColor: isSelected ? "gray" : "transparent",
                      outline: isSelected ? "2px solid #0070f3" : "none",
                      gridColumn: "1",
                    }}
                  >
                    <RenderContext
                      context={item.context}
                      highlight={item.highlight}
                    />
                  </div>

                  {/* Link */}
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: isSelected ? "gray" : "transparent",
                      outline: isSelected ? "2px solid #0070f3" : "none",
                      gridColumn: "2",
                    }}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        style={{ width: "100%", fontSize: "1rem" }}
                        autoFocus
                      />
                    ) : (
                      <a
                        href={item.link}
                        target={
                          item.openingBehavior === "new tab" ? "_blank" : undefined
                        }
                        rel={
                          item.openingBehavior === "new tab"
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {item.link}
                      </a>
                    )}
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: isSelected ? "gray" : "transparent",
                      outline: isSelected ? "2px solid #0070f3" : "none",
                      gridColumn: "3",
                      color: item.status === 200 ? "green" : item.status === 400 ? "red" : "black",
                    }}
                  >
                    Status: {item.status}
                  </div>

                  {/* Opening behavior */}
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: isSelected ? "gray" : "transparent",
                      outline: isSelected ? "2px solid #0070f3" : "none",
                      gridColumn: "4",
                    }}
                  >
                    {item.openingBehavior}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {articleIdx < articles.length - 1 && (
            <hr style={{ marginTop: "16px", border: "1px solid #ddd" }} />
          )}
        </div>
      ))}
    </main>
  );
}