import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KeycloakService, TokenService],
  exports: [KeycloakService, TokenService],
})
export class KeycloakModule {}
