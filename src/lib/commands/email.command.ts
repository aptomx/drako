import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailCommand {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo email es requerido',
  })
  @IsEmail(
    {},
    {
      message: 'El campo email debe ser un correo electrónico valido',
    },
  )
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly email: string;
}
