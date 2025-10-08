type SearchBarProps = {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={"Search..."}
      autoFocus
      style={{
        padding: "8px",
        width: "100%",
        marginBottom: "20px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
  );
}