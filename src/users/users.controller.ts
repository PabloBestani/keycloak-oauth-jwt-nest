import {
  Body,
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from 'src/keycloak/token.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async find() {
    const adminToken = await this.tokenService.getAdminToken();
    return this.usersService.getAllUsers(adminToken);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    try {
      const adminToken = await this.tokenService.getAdminToken();

      return await this.usersService.createUserInKeycloak(
        adminToken,
        createUserDto,
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data?.errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
