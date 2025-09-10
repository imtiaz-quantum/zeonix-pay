import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";



export async function getUserRole(): Promise<'admin' | 'merchant' | 'staff' | null> {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  return session?.user?.role ?? null;
}