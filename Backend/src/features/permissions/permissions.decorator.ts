import { Permission } from '@doclify/types';
import { Reflector } from '@nestjs/core';

export const ValidPermission = Reflector.createDecorator<Permission[] | Permission>();