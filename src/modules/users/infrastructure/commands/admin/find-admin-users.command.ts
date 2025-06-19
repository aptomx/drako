import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { PaginationCommand } from '../../../../../lib/commands/pagination.command';
import isSimpleDate from 'src/lib/decorators/simple-date.decorator';

export class FindAdminUsersCommand extends PaginationCommand {
  @ApiPropertyOptional()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Date in YYYY-MM-DD format',
  })
  @IsOptional()
  @Validate(isSimpleDate)
  readonly startDate?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Date in YYYY-MM-DD format',
  })
  @IsOptional()
  @Validate(isSimpleDate)
  readonly endDate?: string;
}
