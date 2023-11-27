import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNotEmpty, IsString } from 'class-validator';

export class AdminPermissionsCommand {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo moduleId es requerido',
  })
  @IsString({
    message: 'El campo moduleId debe ser número string válido',
  })
  readonly moduleId: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo ver es requerido',
  })
  @IsBooleanString({ message: 'El campo ver es boleano string' })
  readonly view: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo editar es requerido',
  })
  @IsBooleanString({ message: 'El campo editar es boleano string' })
  readonly edit: string;
}
