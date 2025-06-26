import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanString, IsIn, IsNumber, IsOptional } from 'class-validator';
import { Sort } from '../enums/sort.enum';

const sort = Object.values(Sort);

export class PaginationCommand {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'El campo por página debe de ser un número válido',
    },
  )
  @Transform(({ value }) => parseInt(value))
  readonly perPage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'El campo página debe de ser un número válido',
    },
  )
  @Transform(({ value }) => parseInt(value))
  readonly page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  readonly sortType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(sort, {
    message:
      'El campo orden debe ser uno de los siguientes valores: $constraint1',
  })
  readonly sort?: Sort;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  readonly paginate?: string;
}
