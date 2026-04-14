import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'boolean' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const lockTimeStr = user.lockedUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          throw new Error(`Account locked until ${lockTimeStr}`);
        }

        const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isMatch) {
          user.failedLoginAttempts += 1;
          if (user.failedLoginAttempts >= 5) {
            user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
          }
          await user.save();
          throw new Error('Invalid email or password');
        }

        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
        user.lastLogin = new Date();
        user.rememberMe = credentials.rememberMe === 'true';
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          linkedWallet: user.linkedWallet,
          avatarColor: user.avatarColor,
          rememberMe: user.rememberMe,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.linkedWallet = user.linkedWallet;
        token.avatarColor = user.avatarColor;
        token.rememberMe = user.rememberMe;
      }
      
      // Update linked wallet via trigger
      if (trigger === 'update' && session?.linkedWallet) {
        token.linkedWallet = session.linkedWallet;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.linkedWallet = token.linkedWallet;
        session.user.avatarColor = token.avatarColor;
        session.user.rememberMe = token.rememberMe;
        
        // Dynamically adjust expiration if remembered
        if (token.rememberMe) {
          const thirtyDays = 30 * 24 * 60 * 60;
          const expiresDate = new Date(Date.now() + thirtyDays * 1000);
          session.expires = expiresDate.toISOString();
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
