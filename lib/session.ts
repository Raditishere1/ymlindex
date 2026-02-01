import { cookies } from 'next/headers';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import SYSTEM_CONFIG from '../system';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-me'
);

export interface SessionData {
  userId: string;
  role: 'admin' | 'student';
  name: string;
}

export async function createSession(data: SessionData) {
  // Convert SessionData -> JWTPayload (required by jose types)
  const payload: JWTPayload & SessionData = {
    ...data,
    // optional but recommended standard claim
    sub: data.userId,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SYSTEM_CONFIG.providers.auth.sessionName, token, {
    httpOnly: SYSTEM_CONFIG.providers.auth.httpOnly,
    secure: SYSTEM_CONFIG.providers.auth.secure,
    sameSite: SYSTEM_CONFIG.providers.auth.sameSite as any,
    maxAge: SYSTEM_CONFIG.providers.auth.maxAge / 1000,
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SYSTEM_CONFIG.providers.auth.sessionName)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    // Optional: basic validation (avoid undefined fields)
    const userId = payload.userId;
    const role = payload.role;
    const name = payload.name;

    if (
      typeof userId !== 'string' ||
      (role !== 'admin' && role !== 'student') ||
      typeof name !== 'string'
    ) {
      return null;
    }

    return { userId, role, name };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SYSTEM_CONFIG.providers.auth.sessionName);
}
