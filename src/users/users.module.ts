import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  imports: [HttpModule, forwardRef(() => AuthModule), KeycloakModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
