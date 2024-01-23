import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';

type UserResponse = KeycloakUserInterface[] | KeycloakUserInterface;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findUsers(@Query('username') username?: string): Promise<UserResponse> {
    if (username) return await this.usersService.getUserByUsername(username);
    return await this.usersService.getAllUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.usersService.createUserInKeycloak(createUserDto);
  }
}
