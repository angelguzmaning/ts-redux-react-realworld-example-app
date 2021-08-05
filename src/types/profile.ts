import { PublicUser } from './user';

export interface Profile extends PublicUser {
  following: boolean;
}
