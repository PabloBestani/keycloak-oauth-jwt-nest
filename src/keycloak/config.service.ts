import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakConfigService {
  constructor(private readonly configService: ConfigService) {}

  getBaseUrl(): string {
    return this.configService.get<string>('KEYCLOAK_URL');
  }

  getRealm(): string {
    return this.configService.get<string>('KEYCLOAK_REALM');
  }

  getClientId(): string {
    return this.configService.get<string>('KEYCLOAK_CLIENT_ID');
  }

  getUsername(): string {
    return this.configService.get<string>('KEYCLOAK_USERNAME');
  }

  getPassword(): string {
    return this.configService.get<string>('KEYCLOAK_PASSWORD');
  }

  getClientSecret(): string {
    return this.configService.get<string>('KEYCLOAK_SECRET');
  }
}
