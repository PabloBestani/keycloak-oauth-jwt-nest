import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminTokenData } from './definitions/interfaces';
import { TokenService } from './token.service';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpMethod } from 'src/common/definitions/enums';
import { httpRequest } from 'src/common/utils/http';

@Injectable()
export class KeycloakService {
  constructor(
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
  private usersUrl = `${this.keycloakAdminUrl}/users`;

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
      const response = await httpRequest(
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
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };

    try {
      const response = await httpRequest(
        HttpMethod.GET,
        this.usersUrl,
        options,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users from Keycloak');
    }
  }

  async getUserByUsername(username: string): Promise<KeycloakUserInterface> {
    const adminToken = await this.getAdminToken();
    const url = `${this.usersUrl}?username=${username}`;
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };
    try {
      const response = await httpRequest(HttpMethod.GET, url, options);
      const user = response.data;
      if (!user) throw new NotFoundException();
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching user from Keycloak');
    }
  }

  async createUserInKeycloak(createUserDto: CreateUserDto): Promise<string> {
    const adminToken = await this.getAdminToken();
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };
    try {
      const response = await httpRequest(
        HttpMethod.POST,
        this.usersUrl,
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
