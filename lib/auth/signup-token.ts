import { createHash, randomBytes } from "crypto";

export function hashSignupToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSignupToken(): string {
  return randomBytes(32).toString("base64url");
}

export function getSignupTokenSecret(): string {
  const secret = process.env.SIGNUP_TOKEN_SECRET;
  if (!secret) {
    throw new Error("Missing SIGNUP_TOKEN_SECRET");
  }
  return secret;
}
