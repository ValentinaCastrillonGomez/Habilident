import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../shared/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) { }
