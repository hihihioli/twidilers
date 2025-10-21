import { prisma } from './prisma';
import { Account, Post } from '@prisma/client';

export async function findAccount(username?: string): Promise<Account | null> {
  if (!username) {
    return null;
  }
  return await prisma.account.findUnique({
    where: { username: username.toLowerCase() }
  });
}

export async function findAccountByEmail(email: string): Promise<Account | null> {
  return await prisma.account.findUnique({
    where: { email }
  });
}

export function checkUsername(input: string): boolean {
  const pattern = /^[a-zA-Z0-9_]+$/;
  return pattern.test(input);
}

export function checkDisplayName(input: string): boolean {
  const pattern = /^[\w\s]+$/;
  return pattern.test(input);
}

export async function findPost(postId: number): Promise<Post | null> {
  return await prisma.post.findUnique({
    where: { id: postId }
  });
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

export async function validateMentions(usernames: string[]): Promise<string[]> {
  if (!usernames.length) return [];
  
  const accounts = await prisma.account.findMany({
    where: {
      username: {
        in: usernames
      }
    },
    select: {
      username: true
    }
  });
  
  return accounts.map(a => a.username).filter((u): u is string => u !== null);
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

export function checkNotifSettings(account: Account, setting: string): boolean {
  const settings = account.notifSettings as any;
  return settings?.[setting] ?? false;
}

export async function sendNotification(
  setting: string,
  username: string,
  author: string,
  postId: number = 0
) {
  const account = await findAccount(username);
  if (!account) return;

  const notifications = (account.notifications as any[]) || [];
  const dateUtc = new Date();
  
  let post = null;
  if (postId > 0) {
    post = await findPost(postId);
  }

  if (post) {
    notifications.push({
      type: setting,
      author: author,
      title: (post as any).title,
      content: (post as any).content,
      post_id: postId,
      date: dateUtc.getTime() / 1000
    });

    await prisma.account.update({
      where: { id: account.id },
      data: { notifications }
    });
  }
}
