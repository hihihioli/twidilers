// Client-side utility functions for the Next.js frontend

export function checkUsername(input: string): boolean {
  const pattern = /^[a-zA-Z0-9_]+$/;
  return pattern.test(input);
}

export function checkDisplayName(input: string): boolean {
  const pattern = /^[\w\s]+$/;
  return pattern.test(input);
}

const MENTION_REGEX = /(?<![\w@])@([A-Za-z0-9_]{1,32})/g;

export function extractMentions(text: string): string[] {
  if (!text) return [];
  const seen = new Set<string>();
  const mentions: string[] = [];
  const matches = text.matchAll(MENTION_REGEX);
  
  for (const match of matches) {
    const username = match[1].toLowerCase();
    if (!seen.has(username)) {
      seen.add(username);
      mentions.push(username);
    }
  }
  return mentions;
}

export function makeURLHTML(content: string): string {
  // Find URLs
  const urls: string[] = [];
  if (content.includes('https://') || content.includes('http://')) {
    const urlMatches = content.matchAll(/(https?:\/\/\S+)/g);
    for (const match of urlMatches) {
      urls.push(match[1]);
    }
  }

  // Escape HTML
  let escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Replace escaped URLs with HTML links
  for (const url of urls) {
    const escapedUrl = url
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
    const linkHtml = `<a href="${escapedUrl}">${escapedUrl}</a>`;
    escaped = escaped.replace(escapedUrl, linkHtml);
  }

  return escaped;
}
