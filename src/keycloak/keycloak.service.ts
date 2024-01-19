import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AdminTokenData } from './definitions/interfaces';

@Injectable()
export class KeycloakService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
  realm = this.configService.get<string>('KEYCLOAK_REALM');
  clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
  username = this.configService.get<string>('KEYCLOAK_USERNAME');
  password = this.configService.get<string>('KEYCLOAK_PASSWORD');
  clientSecret = this.configService.get<string>('KEYCLOAK_SECRET');

  async getAdminTokenData(): Promise<AdminTokenData> {
    const tokenUrl = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    const payload = new URLSearchParams({
      client_id: this.clientId,
      username: this.username,
      password: this.password,
      client_secret: this.clientSecret,
      grant_type: 'password',
    });

    try {
      const observable = this.httpService.post(tokenUrl, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const response = await lastValueFrom(observable);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
