import { User } from 'firebase/auth';
import { Role } from './role';

export interface UserAuth extends User {
  roles?: Role[];
}
