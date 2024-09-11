import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { EmailCommand } from 'src/lib/commands/email.command';

export class CreateClientUserCommand extends PickType(EmailCommand, [
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
    message: 'La contraseña es requerida',
  })
  @MinLength(8, { message: 'La contraseña debe ser de mínimo 8 caracteres' })
  readonly password: string;
}
