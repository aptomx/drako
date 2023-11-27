import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  Length,
  ValidateNested,
} from 'class-validator';
import { EmailCommand } from 'src/lib/commands/email.command';
import { AdminPermissionsCommand } from './admin-permissions.command';

export class CreateAdminUserCommand extends PickType(EmailCommand, [
  'email',
] as const) {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo nombre es requerido',
  })
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo apellido es requerido',
  })
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo teléfono es requerido',
  })
  @IsNumberString(
    {},
    {
      message: 'El campo teléfono debe de ser un número válido',
    },
  )
  @Length(10, 10, {
    message: 'El campo teléfono debe contener exactamente 10 dígitos',
  })
  readonly phone: string;

  @ApiProperty()
  @IsArray({
    message: 'El campo permisos es un array',
  })
  @ArrayMinSize(1, {
    message: 'El campo permisos es un array de al menos 1 objeto',
  })
  @IsNotEmpty({
    message: 'El campo permisos es requerido',
  })
  @ValidateNested({
    each: true,
    message: 'El campo permisos debe ser un objeto válido',
  })
  @Type(() => AdminPermissionsCommand)
  readonly permissions: AdminPermissionsCommand[];
}
