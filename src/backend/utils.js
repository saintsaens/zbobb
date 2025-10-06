export function decodeZendeskHtml(escapedBody) {
  if (!escapedBody) return "";

  // Decode unicode escapes like \u003C and \u003E
  const unicodeDecoded = escapedBody.replace(/\\u003C/g, "<").replace(/\\u003E/g, ">");

  // Decode escaped quotes, ampersands, etc.
  return unicodeDecoded
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
