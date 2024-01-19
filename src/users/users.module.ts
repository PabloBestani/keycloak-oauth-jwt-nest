import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
