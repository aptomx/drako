import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EmailCommand } from 'src/lib/commands/email.command';

export class LoginCommand extends PickType(EmailCommand, ['email'] as const) {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo password es requerido',
  })
  readonly password: string;
}
