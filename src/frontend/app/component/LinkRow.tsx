import React from "react";
import RenderContext from "./RenderContext";

type LinkRowItem = {
  context: any;
  highlight: any;
  link: string;
  openingBehavior: string;
  status: number;
};

interface LinkRowProps {
  item: LinkRowItem;
  articleIdx: number;
  urlIdx: number;
  urlItems: Array<{ articleIndex: number; urlIndex: number }>;
  selectedIndex: number;
  editingIndex: number;
  editValue: string;
  setEditValue: (value: string) => void;
  handleEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  itemRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
}

export default function LinkRow({
  item,
  articleIdx,
  urlIdx,
  urlItems,
  selectedIndex,
  editingIndex,
  editValue,
  setEditValue,
  handleEditKeyDown,
  itemRefs,
}: LinkRowProps) {
  const globalIndex = urlItems.findIndex(
    (u) => u.articleIndex === articleIdx && u.urlIndex === urlIdx
  );
  const isSelected = selectedIndex === globalIndex;
  const isEditing = editingIndex === globalIndex;

  const baseStyle = {
    padding: 8,
    backgroundColor: isSelected ? "gray" : "transparent",
    outline: isSelected ? "2px solid #0070f3" : "none",
  };

  return (
    <>
      {/* Context */}
      <div ref={(el) => (itemRefs.current[globalIndex] = el)} style={baseStyle}>
        <RenderContext context={item.context} highlight={item.highlight} />
      </div>

      {/* Link */}
      <div style={baseStyle}>
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
            target={item.openingBehavior === "new tab" ? "_blank" : undefined}
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
          ...baseStyle,
          color:
            item.status === 200
              ? "green"
              : item.status === 400
              ? "red"
              : "black",
        }}
      >
        Status: {item.status}
      </div>

      {/* Opening behavior */}
      <div style={baseStyle}>{item.openingBehavior}</div>
    </>
  );
}