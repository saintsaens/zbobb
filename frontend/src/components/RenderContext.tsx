interface RenderContextProps {
  context: string;
  highlight: string;
}

export default function RenderContext({ context, highlight }: RenderContextProps) {
  const parts = context.split(new RegExp(`(${highlight})`, "gi"));

  return parts.map((part, idx) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span
        key={idx}
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          color: "blue",
          padding: "0 2px",
          borderRadius: "2px",
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}