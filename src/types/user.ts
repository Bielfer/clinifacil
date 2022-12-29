import { User as FirebaseUser } from 'firebase/auth';
import { Role } from './role';

export interface UserAuth extends FirebaseUser {
  roles?: Role[];
}

export interface User {
  id?: string;
  role?: Role;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: Date | null;
}
