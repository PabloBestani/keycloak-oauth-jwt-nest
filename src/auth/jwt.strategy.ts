import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/common/definitions/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('KEYCLOAK_SECRET'),
      issuer: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}`,
      audience: configService.get<string>('KEYCLOAK_CLIENT_ID'),
    });
  }

  async validate({ email, role }: { email: string; role: Role }) {
    return {
      email,
      role,
    };
  }
}
