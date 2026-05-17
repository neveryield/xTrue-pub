import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "h2", "h3", "p", "br",
  "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
];

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    return html;
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "src", "alt", "target", "rel", "class"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^:]*$)/i,
  });
}
