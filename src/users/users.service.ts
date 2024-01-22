import { Injectable } from '@nestjs/common';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly keycloakService: KeycloakService) {}

  async getAllUsers(): Promise<KeycloakUserInterface[]> {
    return await this.keycloakService.getAllUsers();
  }

  async createUserInKeycloak(createUserDto: CreateUserDto): Promise<string> {
    return await this.keycloakService.createUserInKeycloak(createUserDto);
  }
}
