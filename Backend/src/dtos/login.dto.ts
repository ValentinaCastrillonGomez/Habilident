import { UserDto } from './user.dto';

export type LoginDto = Pick<UserDto, 'username' | 'password'>;