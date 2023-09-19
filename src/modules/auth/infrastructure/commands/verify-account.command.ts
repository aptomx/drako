import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EmailCommand } from '../../../../lib/commands/email.command';

export class VerifyAccountCommand extends PickType(EmailCommand, [
  'email',
] as const) {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Campo código es requerido',
  })
  readonly code: string;
}
