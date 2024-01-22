import { Body, Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async find(): Promise<KeycloakUserInterface[]> {
    return await this.usersService.getAllUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.usersService.createUserInKeycloak(createUserDto);
  }
}
