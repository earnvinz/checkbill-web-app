import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { googleOAuthConfig } from '@/configs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleOAuthConfig.clientId,
      clientSecret: googleOAuthConfig.clientSecret,
    }),
  ],
  pages: {
    signIn: '/login',
  },
};
