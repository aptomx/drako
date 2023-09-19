import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { EmailCommand } from 'src/lib/commands/email.command';

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
}
