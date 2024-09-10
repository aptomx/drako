import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';
import { UsersService } from 'src/modules/users/domain/services/users.service';
import { CreateClientUserCommand } from '../../commands/client/create-client-user.command';

@Controller(`${BASE_PREFIX_API}/client`)
export class ClientUsersController {
  constructor(private usersService: UsersService) {}

  @ApiTags('Client')
  @ApiOperation({ summary: 'Client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns an client user if was created successfully',
  })
  @Post()
  async create(@Body() body: CreateClientUserCommand): Promise<IUser> {
    return await this.usersService.createUserNormal(body);
  }
}
