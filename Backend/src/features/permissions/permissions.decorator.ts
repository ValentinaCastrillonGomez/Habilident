import { Permission } from '@habilident/types';
import { Reflector } from '@nestjs/core';

export const ValidPermission = Reflector.createDecorator<Permission>();