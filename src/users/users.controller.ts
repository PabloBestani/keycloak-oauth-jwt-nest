import { Body, Controller, Post, Get, Query, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { KeycloakUserInterface } from 'src/common/definitions/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';

type UserResponse = KeycloakUserInterface[] | KeycloakUserInterface;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findUsers(@Query('username') username?: string): Promise<UserResponse> {
    if (username) return await this.usersService.getUserByUsername(username);
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<KeycloakUserInterface> {
    return await this.usersService.getUserById(id);
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<KeycloakUserInterface> {
    return await this.usersService.createUserInKeycloak(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.usersService.updateUserInKeycloak(id, updateUserDto);
  }
}
