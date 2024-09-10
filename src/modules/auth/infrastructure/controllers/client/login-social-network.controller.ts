import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { IAuthentication } from '../../../domain/interfaces/authentication.interface';
import { LoginSocialNetworkCommand } from '../../commands/login-social-network.command';
import { SocialNetworkService } from '../../../domain/services/social-network.service';

@Controller(`${BASE_PREFIX_API}/client/auth`)
export class LoginSocialNetworkController {
  constructor(private socialNetworkService: SocialNetworkService) {}

  @ApiTags('Client auth')
  @ApiOperation({ summary: 'Client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns user object and token',
  })
  @Post('social')
  async loginSocialNetwork(
    @Body() loginSocialNetwork: LoginSocialNetworkCommand,
  ): Promise<IAuthentication> {
    return await this.socialNetworkService.registerSocialNetwork(
      loginSocialNetwork,
    );
  }
}
