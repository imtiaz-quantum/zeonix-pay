"use server"
import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";


const handler = NextAuth(authOptions);
console.log(handler)
export { handler as GET, handler as POST };