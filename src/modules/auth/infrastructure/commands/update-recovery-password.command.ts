import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Match } from 'src/lib/decorators/match.decorator';

export class UpdateRecoveryPasswordCommand {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El token es requerido',
  })
  readonly token: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'La confirmación de contraseña es requerida',
  })
  @Match('password')
  readonly passwordConfirmation: string;
}
