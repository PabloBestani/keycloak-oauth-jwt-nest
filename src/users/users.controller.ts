import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   @Get()
  //   async find() {
  //     return this.usersService.getAllUsers();
  //   }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Aquí debes obtener el token de administrador de alguna manera.
    // Podría ser desde el request, una variable de entorno, o un servicio dedicado.
    const adminToken = 'adaf';

    return await this.usersService.createUserInKeycloak(
      adminToken,
      createUserDto,
    );
  }
}
