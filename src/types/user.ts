import { User as FirebaseUser } from 'firebase/auth';
import { Role } from './role';

export interface UserAuth extends FirebaseUser {
  roles?: Role[];
}
