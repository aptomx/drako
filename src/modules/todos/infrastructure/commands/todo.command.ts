import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TodoCommand {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El cuerpo del mensaje es requerido',
  })
  readonly content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly isDone: boolean;
}
