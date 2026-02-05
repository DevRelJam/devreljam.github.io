export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === 'string') el.textContent = text;
  return el;
}

export function safeExternalLink(href) {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

export function absoluteUrl(path, base) {
  if (!path) return '';
  try {
    return new URL(path, base).toString();
  } catch (_) {
    return path;
  }
}
