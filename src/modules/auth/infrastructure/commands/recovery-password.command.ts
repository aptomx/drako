import { PickType } from '@nestjs/swagger';
import { EmailCommand } from '../../../../lib/commands/email.command';

export class RecoveryPasswordCommand extends PickType(EmailCommand, [
  'email',
] as const) {}
