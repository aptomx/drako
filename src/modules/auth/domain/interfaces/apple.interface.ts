import type { JwtPayload } from 'jsonwebtoken';
import { DriversSocialNetwork } from '../enums/drivers-social-network.enum';

export interface IApple {
  provider: DriversSocialNetwork.Apple;
  email: string;
  first_name: string;
  last_name: string;
}

export interface VerifyAppleIdTokenParams {
  tokenId: string;
  clientId: string | string[];
  nonce?: string;
}

/**
 * The identity token is a JSON Web Token (JWT) and contains the following claims:
 * {@link https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple#3383773}
 */
export interface VerifyAppleIdTokenResponse extends JwtPayload {
  iss: string;

  sub: string;

  aud: string;

  iat: number;

  exp: number;

  nonce?: string;

  nonce_supported: boolean;

  email: string;

  email_verified: boolean;

  is_private_email?: boolean;

  real_user_status?: number;

  transfer_sub?: string;

  c_hash: string;
}
