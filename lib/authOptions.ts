/* 
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface APIUser {
  id: number;
  username: string;
  email?: string;
  token: string;
}

interface AppUser extends APIUser {
  role: 'admin' | 'merchant' | 'staff';
}

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'admin' | 'merchant' | 'staff';
    };
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'merchant' | 'staff';
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials): Promise<any> {
        console.log(credentials);

        if (!credentials) return null;

        // Map role to correct API URL
        const endpointMap: Record<string, string> = {
          merchant: 'http://192.168.68.130:8000/api/v1/auth/merchant/login/',
          admin: 'http://192.168.68.130:8000/api/v1/auth/admin/login/',
          staff: 'http://192.168.68.130:8000/api/v1/auth/staff/login/',
        };

        const apiUrl = endpointMap[credentials.role as string];
        if (!apiUrl) return null;

        try {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            let apiErr = { message: 'Login failed' };
            try { apiErr = await res.json(); } catch { }
            throw new Error(apiErr.message);
          }


          const user: APIUser = await res.json();
          console.log('User dataaaaaa:', user);
          return {
            ...user,
            role: credentials.role as 'admin' | 'merchant' | 'staff',
          } as any;
        } catch (error) {
          if (error instanceof Error && error.message) {
            throw new Error(error.message);
          }
          throw new Error(JSON.stringify({ status: false, message: 'Network error' }));
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'admin' | 'merchant' | 'staff';
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
 */

import { NextAuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type LoginRole = "admin" | "merchant" | "staff";

interface APIUser {
  id: number;
  username: string;
  email?: string | null;
  token: string;
}

// extra fields we attach to the NextAuth User at sign-in time
type AuthUser = User & {
  role: LoginRole;
  token: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      role: LoginRole;
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: LoginRole;
    accessToken: string;
  }
}
const baseUrl = process.env.BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(
        credentials,
        _req
      ): Promise<User | null> {
        if (!credentials) return null;
        
        const role = (credentials.role as LoginRole) ?? "merchant";
        const endpointMap: Record<LoginRole, string> = {
          merchant: `${baseUrl}/auth/merchant/login/`,
          admin: `${baseUrl}/auth/admin/login/`,
          staff: `${baseUrl}/auth/staff/login/`,
        };
        const apiUrl = endpointMap[role];
        
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });
        console.log(baseUrl);
        
        if (!res.ok) {
          let apiErr: { message?: string } = { message: "Login failed" };
          try { apiErr = await res.json(); } catch {}
          throw new Error(apiErr.message ?? "Login failed");
        }
        
        const apiUser: APIUser = await res.json();
        
        // Return a NextAuth User 
        const user: AuthUser = {
          id: String(apiUser.id),
          name: apiUser.username,
          email: apiUser.email ?? "",
          role,
          token: apiUser.token,
        };

        return user; // satisfies User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;
        token.role = u.role;
        token.accessToken = u.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as LoginRole;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
