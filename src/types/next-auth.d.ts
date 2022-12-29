import { Session as NextAuthSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends NextAuthSession {
    user: User;
  }

  interface User {
    id: string;
    role?: Role | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: Date | null;
  }
}
