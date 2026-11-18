import "server-only";
import sanitize from "sanitize-html";

/** Cleans article HTML from the editor: only simple formatting, safe links and images. */
export function cleanHtml(html: string) {
  return sanitize(html, {
    allowedTags: ["h2", "h3", "h4", "p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "img", "figure", "figcaption"],
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tag, attribs) => ({
        tagName: "a",
        attribs: /^https?:\/\//.test(attribs.href ?? "") ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}

/** Plain text from HTML, for word counts and summaries. */
export function htmlText(html: string) {
  return sanitize(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}
