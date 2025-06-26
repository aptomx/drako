import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { UserModel } from 'src/modules/users/domain/models/user.model';
import { BASE_PREFIX_API } from '../../../../../config/magicVariables';
import { AuthService } from '../../domain/services/auth.service';
import { RecoveryPasswordCommand } from '../commands/recovery-password.command';
import { UpdateRecoveryPasswordCommand } from '../commands/update-recovery-password.command';
import { VerifyAccountCommand } from '../commands/verify-account.command';
import { VerifyRecoveryPasswordCommand } from '../commands/verify-recovery-password.command';

@Controller(`${BASE_PREFIX_API}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Auth')
  @ApiOperation({ summary: '(All users)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'returns an updated user if was verified successfully',
  })
  @Post('verify/account')
  async verifyEmailAccount(
    @Body() body: VerifyAccountCommand,
  ): Promise<UserModel> {
    return await this.authService.verifyEmailAccount(body);
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: '(All users)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'returns an confirmation message if a email was sent succesfully',
  })
  @Post('recover/password')
  async recoveryPassword(
    @Body() body: RecoveryPasswordCommand,
  ): Promise<IDisplayMessageSuccess> {
    await this.authService.sendRecoveryPasswordCode(body.email);

    return {
      displayMessage:
        'Se ha enviado un email con el código para recuperar la contraseña',
    };
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: '(All users)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'returns a token if code is valid',
  })
  @Post('validate/recovery/code')
  async verifyRecoveryPasswordCode(
    @Body() body: VerifyRecoveryPasswordCommand,
  ): Promise<{ token: string }> {
    const token = await this.authService.verifyRecoveryPasswordCode(body);
    return { token };
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: '(All users)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'returns a confirmation message if password was updated successfully',
  })
  @Patch('update/password/recovery')
  async updatePassword(
    @Body() body: UpdateRecoveryPasswordCommand,
  ): Promise<IDisplayMessageSuccess> {
    await this.authService.updatePassword(body);

    return { displayMessage: 'La contraseña fue actualizada exitosamente' };
  }
}
