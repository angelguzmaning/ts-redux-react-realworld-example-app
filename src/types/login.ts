import { array, dict, string } from 'decoders';

export type LoginError = Record<string, string[]>;

export const loginErrorDecoder = dict(array(string));
