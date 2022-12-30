import { User as FirebaseUser } from 'firebase/auth';
import type { User as NextAuthUser } from 'next-auth';
import { Role } from './role';

export interface UserAuth extends FirebaseUser {
  roles?: Role[];
}

export type User = NextAuthUser;
