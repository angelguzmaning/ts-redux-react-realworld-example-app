import { Decoder, nullable, object, string } from 'decoders';

export interface PublicUser {
  username: string;
  bio: string | null;
  image: string | null;
}

export interface User extends PublicUser {
  email: string;
  token: string;
}

export const userDecoder: Decoder<User> = object({
  email: string,
  token: string,
  username: string,
  bio: nullable(string),
  image: nullable(string),
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
}
