import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TodoCommand {
  @ApiProperty()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly isDone: boolean;
}
