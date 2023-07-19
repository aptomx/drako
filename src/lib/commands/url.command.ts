import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UrlCommand {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo url es requerido',
  })
  readonly url: string;
}
