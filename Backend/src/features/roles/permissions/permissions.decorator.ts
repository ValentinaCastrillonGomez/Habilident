import { Permission } from '@habilident/types';
import { Reflector } from '@nestjs/core';

export const Permissions = Reflector.createDecorator<Permission[]>();