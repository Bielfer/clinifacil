import { Session as NextAuthSession } from 'next-auth';
import { User as MyUser } from './user';

declare module 'next-auth' {
  interface Session extends NextAuthSession {
    user: MyUser;
  }

  interface User extends MyUser {}
}
