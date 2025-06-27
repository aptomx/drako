import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { BadRequestException, Logger } from '@nestjs/common';
import {
  IVerifyAppleIdTokenParams,
  IVerifyAppleIdTokenResponse,
} from '../../interfaces/apple.interface';
import { DriversSocialNetwork } from '../../enums/drivers-social-network.enum';
import { SOCIAL_NETWORK_TOKEN_ERROR } from 'config/messageResponses';

const APPLE_BASE_URL = 'https://appleid.apple.com';
const JWKS_APPLE_URI = '/auth/keys';
const DRIVER = DriversSocialNetwork.Apple;
const logger = new Logger('AppleIdTokenVerification');

export const getApplePublicKey = async (kid: string): Promise<string> => {
  const client = jwksClient({
    jwksUri: `${APPLE_BASE_URL}${JWKS_APPLE_URI}`,
  });
  const key = await new Promise<jwksClient.SigningKey>((resolve, reject) => {
    client.getSigningKey(kid, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
  return key.getPublicKey();
};

export const verifyAppleToken = async (
  params: IVerifyAppleIdTokenParams,
): Promise<IVerifyAppleIdTokenResponse> => {
  //Get and validate token data
  const decoded = jwt.decode(params.tokenId, { complete: true });
  if (!decoded) {
    throw new BadRequestException(SOCIAL_NETWORK_TOKEN_ERROR(DRIVER));
  }
  const { kid, alg } = decoded.header;

  //Get the public keys from Apple and find the key that matches the token key
  let applePublicKey = null;
  try {
    applePublicKey = await getApplePublicKey(kid);
  } catch (error) {
    logger.error('Failed to get Apple public key', error?.stack);
    throw new BadRequestException(
      'No se encontró una clave de Apple válida para el token',
    );
  }

  //Valid token and expiration
  let jwtClaims = null;
  try {
    jwtClaims = jwt.verify(params.tokenId, applePublicKey, {
      algorithms: [alg as jwt.Algorithm],
    }) as IVerifyAppleIdTokenResponse;
  } catch (error) {
    logger.error('Apple ID token verification failed', error?.stack);
    throw new BadRequestException(SOCIAL_NETWORK_TOKEN_ERROR(DRIVER));
  }

  //Validate the issuer, in this case apple
  if (jwtClaims?.iss !== APPLE_BASE_URL) {
    throw new Error(
      `El iss no coincide con la URL de Apple - encontrado: ${jwtClaims.iss} | esperado: ${APPLE_BASE_URL}`,
    );
  }

  //Validate the audience
  const isFounded = []
    .concat(jwtClaims.aud)
    .some((aud) => [].concat(params.clientId).includes(aud));

  if (isFounded) {
    ['email_verified', 'is_private_email'].forEach((field) => {
      if (jwtClaims[field] !== undefined) {
        jwtClaims[field] = Boolean(jwtClaims[field]);
      }
    });
    return jwtClaims;
  }

  throw new Error(
    `El parámetro aud no incluye este cliente - encontrado: ${jwtClaims.aud} | esperado: ${params.clientId}`,
  );
};
export default verifyAppleToken;
