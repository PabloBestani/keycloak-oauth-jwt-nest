import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AdminTokenData } from './definitions/interfaces';
import { TokenService } from './token.service';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class KeycloakService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  private keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
  private realm = this.configService.get<string>('KEYCLOAK_REALM');
  private clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
  private username = this.configService.get<string>('KEYCLOAK_USERNAME');
  private password = this.configService.get<string>('KEYCLOAK_PASSWORD');
  private clientSecret = this.configService.get<string>('KEYCLOAK_SECRET');
  private keycloakAdminUrl = `${this.keycloakUrl}/admin/realms/${this.realm}`;

  private async getAdminToken(): Promise<string> {
    const activeToken = this.tokenService.getActiveAdminToken();
    if (activeToken) return activeToken;

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
      const tokenData: AdminTokenData = response.data;
      this.tokenService.updateTokenData(tokenData);
      return tokenData.access_token;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllUsers(): Promise<KeycloakUserInterface[]> {
    const adminToken = await this.getAdminToken();
    const url = `${this.keycloakAdminUrl}/users`;

    try {
      const observable = this.httpService.get(url, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const response = await lastValueFrom(observable);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users from Keycloak');
    }
  }

  async createUserInKeycloak(createUserDto: CreateUserDto): Promise<string> {
    const adminToken = await this.getAdminToken();
    const url = `${this.keycloakAdminUrl}/users`;
    try {
      const observable = this.httpService.post(url, createUserDto, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const response = await lastValueFrom(observable);
      if (response) {
        return `User ${createUserDto.username} created successfully.`;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
