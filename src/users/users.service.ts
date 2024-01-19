import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private keycloakAdminUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakAdminUrl = `${this.configService.get<string>('KEYCLOAK_URL')}/admin/realms/${this.configService.get<string>('KEYCLOAK_REALM')}`;
  }

  async getAllUsers(adminToken: string): Promise<any> {
    const url = `${this.keycloakAdminUrl}/users`;
    try {
      const response = await this.httpService.get(url, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users from Keycloak');
    }
  }

  async createUserInKeycloak(
    adminToken: string,
    createUserDto: CreateUserDto,
  ): Promise<any> {
    const url = `${this.keycloakAdminUrl}/users`;
    try {
      const response = await this.httpService.post(url, createUserDto, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log(response);
      return 'Lo logramoss, creamos un user en keycloak';
    } catch (error) {
      console.error(error);
    }
  }
}
