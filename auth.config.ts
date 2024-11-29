import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcryptjs from 'bcryptjs';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await sql`
            SELECT * FROM users WHERE email=${email}
          `.then(res => res.rows[0]);
          
          if (!user) return null;
          
          const passwordsMatch = await bcryptjs.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
