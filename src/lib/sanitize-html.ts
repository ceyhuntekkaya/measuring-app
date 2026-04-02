export function sanitizeHtml(input: string): string {
  const html = (input ?? '').toString();

  // Server-side (or no DOM): do minimal stripping to avoid obvious XSS.
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/\son\w+="[^"]*"/gi, '')
      .replace(/\son\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Drop script/style tags entirely
  doc.querySelectorAll('script, style').forEach((n) => n.remove());

  // Remove inline event handlers and javascript: URLs
  doc.querySelectorAll<HTMLElement>('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        continue;
      }

      if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(value)) {
        el.removeAttribute(attr.name);
        continue;
      }
    }
  });

  return doc.body.innerHTML;
}

