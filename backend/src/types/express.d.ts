import { AuthUser } from './index';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}