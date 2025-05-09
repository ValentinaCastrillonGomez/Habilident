import { User } from "./user";

export type Login = Pick<User, 'email' | 'password'>;