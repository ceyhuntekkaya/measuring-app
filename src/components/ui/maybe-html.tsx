import React from "react";
import HtmlRender from "@/components/ui/html-render";

export interface MaybeHtmlProps {
  value?: string | null;
  className?: string;
}

const HTML_LIKE_RE = /<\/?[a-z][\s\S]*>/i;

export default function MaybeHtml({ value, className }: MaybeHtmlProps) {
  const text = value ?? "";
  if (!text) return null;

  if (HTML_LIKE_RE.test(text)) {
    return <HtmlRender html={text} className={className} />;
  }

  return <span className={className}>{text}</span>;
}

