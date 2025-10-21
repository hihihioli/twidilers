import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractMentions, validateMentions } from '@/lib/functions';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

const POSTS_PER_PAGE = 15;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const pageNum = parseInt(page);
    const offset = (pageNum - 1) * POSTS_PER_PAGE;

    // Get current user if logged in
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    let currentUser = null;
    if (session.username) {
      currentUser = await prisma.account.findUnique({
        where: { username: session.username }
      });
    }

    const posts = await prisma.post.findMany({
      take: POSTS_PER_PAGE,
      skip: offset,
      orderBy: { id: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayname: true
          }
        },
        likedBy: {
          select: {
            id: true
          }
        }
      }
    });

    // Format posts for response
    const response = await Promise.all(
      posts.map(async (post) => {
        const rawMentions = extractMentions(post.content);
        const validMentions = await validateMentions(rawMentions);
        const mentionsCurrentUser = currentUser ? validMentions.includes(currentUser.username!) : false;

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          date: post.date.toISOString(),
          likes: post.likedBy.map(u => u.id),
          mentions: validMentions,
          mentions_current_user: mentionsCurrentUser,
          author: {
            id: post.author.id,
            username: post.author.username,
            displayname: post.author.displayname,
            photo_url: `/api/pfp/${post.author.username}`,
            profile_link: `/profile/${post.author.username}`
          }
        };
      })
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
