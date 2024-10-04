import { User } from "./user";

export type Login = Pick<User, 'username' | 'password'>;