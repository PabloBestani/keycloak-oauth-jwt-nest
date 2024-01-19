import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';

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

  async createUserInKeycloak(
    adminToken: string,
    createUserDto: CreateUserDto,
  ): Promise<string> {
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
