import { Injectable, NotFoundException } from '@nestjs/common';
import { KeycloakConfigService } from './config.service';
import { AdminTokenData } from './definitions/interfaces';
import { TokenService } from './token.service';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpMethod } from 'src/common/definitions/enums';
import { httpRequest } from 'src/common/utils/http';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class KeycloakService {
  constructor(
    private readonly keycloakConfigService: KeycloakConfigService,
    private readonly tokenService: TokenService,
  ) {}

  private baseUrl = this.keycloakConfigService.getBaseUrl();
  private realm = this.keycloakConfigService.getRealm();
  private clientId = this.keycloakConfigService.getClientId();
  private username = this.keycloakConfigService.getUsername();
  private password = this.keycloakConfigService.getPassword();
  private clientSecret = this.keycloakConfigService.getClientSecret();
  private adminUrl = `${this.baseUrl}/admin/realms/${this.realm}`;
  private usersUrl = `${this.adminUrl}/users`;

  private async getAdminToken(): Promise<string> {
    const activeToken = this.tokenService.getActiveAdminToken();
    if (activeToken) return activeToken;

    const tokenUrl = `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;
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

  async getUserById(id: string): Promise<KeycloakUserInterface> {
    const adminToken = await this.getAdminToken();
    const url = `${this.usersUrl}/${id}`;
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
      throw new Error('Error fetching user from Keycloak.');
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

  async createUserInKeycloak(
    createUserDto: CreateUserDto,
  ): Promise<KeycloakUserInterface> {
    const adminToken = await this.getAdminToken();
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };
    try {
      await httpRequest(HttpMethod.POST, this.usersUrl, options, createUserDto);

      const newUser = await this.getUserByUsername(createUserDto.username);
      return newUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUserInKeycloak(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const adminToken = await this.getAdminToken();
    const url = `${this.usersUrl}/${id}`;
    const options = {
      headers: { Authorization: `Bearer ${adminToken}` },
    };
    try {
      await httpRequest(HttpMethod.PUT, url, options, updateUserDto);
      const updatedUser = await this.getUserById(id);
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating user in keycloak.');
    }
  }
}
