import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AdminTokenData } from './definitions/interfaces';
import { TokenService } from './token.service';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpMethod } from './definitions/enums';

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

  private async httpRequest(
    method: HttpMethod,
    url: string,
    options: object,
    body: string | object,
  ): Promise<any>;
  private async httpRequest(
    method: HttpMethod,
    url: string,
    options: object,
  ): Promise<any>;

  private async httpRequest(
    method: HttpMethod,
    url: string,
    options?: object,
    body?: string | object,
  ): Promise<any> {
    try {
      if (method === HttpMethod.GET) {
        const observable = this.httpService.get(url, options);
        const response = await lastValueFrom(observable);
        if (!response)
          throw new Error(
            `Error attempting to get data (KeycloakService/sendRequest)`,
          );
        return response;
      } else {
        const observable = this.httpService[method](url, body, options);
        const response = await lastValueFrom(observable);
        if (!response)
          throw new Error(
            `Error attempting to ${method} data (KeycloakService/sendRequest)`,
          );
        return response;
      }
    } catch (error) {
      throw error;
    }
  }

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
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    try {
      const response = await this.httpRequest(
        HttpMethod.POST,
        tokenUrl,
        options,
        payload.toString(),
      );
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
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };

    try {
      const response = await this.httpRequest(HttpMethod.GET, url, options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users from Keycloak');
    }
  }

  async createUserInKeycloak(createUserDto: CreateUserDto): Promise<string> {
    const adminToken = await this.getAdminToken();
    const url = `${this.keycloakAdminUrl}/users`;
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };
    try {
      const response = await this.httpRequest(
        HttpMethod.POST,
        url,
        options,
        createUserDto,
      );
      if (response) {
        return `User ${createUserDto.username} created successfully.`;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
