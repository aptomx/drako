import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { DriversSocialNetworkList } from '../../domain/enums/drivers-social-network.enum';

export class LoginSocialNetworkCommand {
  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo driver es requerido',
  })
  @IsIn(DriversSocialNetworkList, {
    message:
      'El campo $property debe ser uno de los siguientes valores: $constraint1',
  })
  readonly driver: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'El campo token es requerido',
  })
  readonly token: string;

  @ApiProperty()
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  readonly lastName: string;
}
