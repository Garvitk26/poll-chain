import { type DefaultSession, type DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'creator' | 'voter';
      linkedWallet?: string;
      avatarColor: string;
      rememberMe?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'creator' | 'voter';
    linkedWallet?: string;
    avatarColor: string;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'creator' | 'voter';
    linkedWallet?: string;
    avatarColor: string;
    rememberMe?: boolean;
  }
}
