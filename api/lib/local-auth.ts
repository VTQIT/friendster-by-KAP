import * as jose from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "@db/schema";
import type { User } from "@db/schema";
import { getDb } from "../queries/connection";
import { env } from "./env";

const JWT_ALG = "HS256";
const LOCAL_AUTH_SECRET = env.appSecret + "_local";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}

export async function comparePin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}

export async function signLocalToken(userId: number): Promise<string> {
  const secret = new TextEncoder().encode(LOCAL_AUTH_SECRET);
  return new jose.SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyLocalToken(token: string): Promise<User | undefined> {
  if (!token) return undefined;
  try {
    const secret = new TextEncoder().encode(LOCAL_AUTH_SECRET);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    const userId = payload.userId as number;
    if (!userId) return undefined;

    const rows = await getDb()
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return rows.at(0);
  } catch {
    return undefined;
  }
}

export function generateMagicToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
