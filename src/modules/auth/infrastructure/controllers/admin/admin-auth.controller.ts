import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../domain/services/auth.service';
import { LocalAuthGuard } from '../../../../../lib/guards/local-auth.guard';
import { LoginCommand } from '../../commands/login-command';
import { BASE_PREFIX_API } from '../../../../../../config/magicVariables';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { IAuthentication } from 'src/modules/auth/domain/interfaces/authentication.interface';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { LoggerService } from '../../../../../lib/vendor/logger/logger.service';

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
      throw new NotFoundException('Usuario no encontrado');
    }
    const token = await this.authService.generateTokenByUser(user);

    return {
      user,
      accessToken: token,
    };
  }

  @ApiTags('Auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user admin object',
  })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async get(@Request() req) {
    const { user } = req;
    if (user.userRole.roleId != UserRoles.Admin) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
