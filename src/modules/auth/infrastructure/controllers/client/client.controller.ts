import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { LocalAuthGuard } from 'src/lib/guards/local-auth.guard';
import { LoggerService } from 'src/lib/vendor/logger/logger.service';
import { AuthService } from 'src/modules/auth/domain/services/auth.service';
import { LoginCommand } from '../../commands/login-command';
import { IAuthentication } from 'src/modules/auth/domain/interfaces/authentication.interface';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { AuthUserNotFoundError } from 'src/modules/auth/errors/auth-user-not-found-error';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';

@Controller(`${BASE_PREFIX_API}/client/auth`)
export class ClientController {
  constructor(private authService: AuthService) {}

  @ApiTags('Client auth')
  @ApiOperation({ summary: 'Client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns an client user and token if was logged successfully',
  })
  @UseGuards(new LocalAuthGuard(new LoggerService()))
  @Post('login')
  async login(
    @Body() _body: LoginCommand,
    @Request() req,
  ): Promise<IAuthentication> {
    const { user } = req;
    if (user.userRole.roleId != UserRoles.Client) {
      throw new AuthUserNotFoundError('Usuario no encontrado');
    }
    const token = await this.authService.generateTokenByUser(user);

    return {
      user,
      accessToken: token,
    };
  }

  @ApiTags('Client auth')
  @ApiOperation({ summary: 'Client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user client object',
  })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async get(@Request() req) {
    const { user } = req;
    if (user.userRole.roleId != UserRoles.Client) {
      throw new AuthUserNotFoundError('Usuario no encontrado');
    }
    return user;
  }
}
