import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

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
