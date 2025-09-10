import { Session } from "next-auth";

export function getAccessToken(session: Session | null): string | null {
  if (!session) return null;
  const maybe = (session as unknown as { accessToken?: unknown }).accessToken;
  if (typeof maybe === "string") return maybe;
  if (typeof maybe === "object" && maybe !== null && "access" in maybe) {
    const access = (maybe as { access?: unknown }).access;
    if (typeof access === "string") return access;
  }
  return null;
}