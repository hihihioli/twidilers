import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Find account by username or displayname
    const account = await prisma.account.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase() },
          { displayname: username }
        ]
      }
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Username or password is incorrect' },
        { status: 401 }
      );
    }

    if (!account.verified) {
      return NextResponse.json(
        { error: 'Please verify your account' },
        { status: 403 }
      );
    }

    // Verify password
    if (!account.passwordHash) {
      return NextResponse.json(
        { error: 'Password not set for this account' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, account.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Username or password is incorrect' },
        { status: 401 }
      );
    }

    // Create session
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.username = account.username!;
    session.userId = account.id;
    await session.save();

    return NextResponse.json({
      success: true,
      username: account.username
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
