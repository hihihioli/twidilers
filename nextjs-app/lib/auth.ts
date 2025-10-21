import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<Buffer> {
  const hash = await bcrypt.hash(password, 10);
  return Buffer.from(hash);
}

export async function verifyPassword(password: string, hashedPassword: Buffer): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword.toString());
}

export function generateVerifyToken(userId: number, expiresIn: number = 600): string {
  return jwt.sign(
    { verify: userId, exp: Math.floor(Date.now() / 1000) + expiresIn },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
}

export function verifyVerifyToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as { verify: number };
    return decoded.verify;
  } catch {
    return null;
  }
}

export function generateResetPasswordToken(userId: number, expiresIn: number = 600): string {
  return jwt.sign(
    { reset: userId, exp: Math.floor(Date.now() / 1000) + expiresIn },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
}

export function verifyResetPasswordToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as { reset: number };
    return decoded.reset;
  } catch {
    return null;
  }
}
