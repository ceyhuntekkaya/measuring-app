'use client';

import * as React from 'react';
import { sanitizeHtml } from '@/lib/sanitize-html';

export interface HtmlRenderProps {
  html: string;
  className?: string;
}

export function HtmlRender({ html, className = '' }: HtmlRenderProps) {
  const safe = React.useMemo(() => sanitizeHtml(html || ''), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}

export default HtmlRender;

