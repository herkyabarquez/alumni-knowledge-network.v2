import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { jwksRestful } from 'jwks-rsa';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth?.token;
      
      if (!token) {
        throw new WsException('Unauthorized: No token provided');
      }

      const cleanToken = token.replace('Bearer ', '');
      
      // Verify the token using Auth0's JWKS
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(
          cleanToken,
          passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
          }),
          {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) {
              console.error('WS JWT Verification Error:', err.message);
              return reject(err);
            }
            resolve(decoded);
          },
        );
      });

      client['user'] = payload;
      return true;
    } catch (err) {
      console.error('WsJwtGuard: Auth failed', err.message);
      throw new WsException('Unauthorized');
    }
  }
}
