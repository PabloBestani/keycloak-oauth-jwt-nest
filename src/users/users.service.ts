import { Injectable } from '@nestjs/common';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly keycloakService: KeycloakService) {}

  async getAllUsers(): Promise<KeycloakUserInterface[]> {
    return await this.keycloakService.getAllUsers();
  }

  async getUserByUsername(username: string): Promise<KeycloakUserInterface> {
    return await this.keycloakService.getUserByUsername(username);
  }

  async getUserById(id: string): Promise<KeycloakUserInterface> {
    return await this.keycloakService.getUserById(id);
  }

  async createUserInKeycloak(
    createUserDto: CreateUserDto,
  ): Promise<KeycloakUserInterface> {
    return await this.keycloakService.createUserInKeycloak(createUserDto);
  }

  async updateUserInKeycloak(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.keycloakService.updateUserInKeycloak(id, updateUserDto);
  }
}
