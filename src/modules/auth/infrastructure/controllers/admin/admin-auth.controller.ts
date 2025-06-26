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
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { IAuthentication } from 'src/modules/auth/domain/interfaces/authentication.interface';
import { AuthUserNotFoundError } from 'src/modules/auth/errors/auth-user-not-found-error';
import { BASE_PREFIX_API } from '../../../../../../config/magicVariables';
import { LocalAuthGuard } from '../../../../../lib/guards/local-auth.guard';
import { LoggerService } from '../../../../../lib/vendor/logger/logger.service';
import { AuthService } from '../../../domain/services/auth.service';
import { LoginCommand } from '../../commands/login-command';

@Controller(`${BASE_PREFIX_API}/admin/auth`)
export class AdminAuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Admin auth')
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns an admin user and token if was logged successfully',
  })
  @UseGuards(new LocalAuthGuard(new LoggerService()))
  @Post('login')
  async login(
    @Body() _body: LoginCommand,
    @Request() req,
  ): Promise<IAuthentication> {
    const { user } = req;
    if (user.userRole.roleId != UserRoles.Admin) {
      throw new AuthUserNotFoundError('Usuario no encontrado');
    }
    const token = await this.authService.generateTokenByUser(user);

    return {
      user,
      accessToken: token,
    };
  }

  @ApiTags('Admin auth')
  @ApiOperation({ summary: 'Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user admin object',
  })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async get(@Request() req) {
    const { user } = req;
    if (user.userRole.roleId != UserRoles.Admin) {
      throw new AuthUserNotFoundError('Usuario no encontrado');
    }
    return user;
  }
}
