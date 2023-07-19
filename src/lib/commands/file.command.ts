import { ApiProperty } from '@nestjs/swagger';
export class FileCommand {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  readonly file: string;
}
