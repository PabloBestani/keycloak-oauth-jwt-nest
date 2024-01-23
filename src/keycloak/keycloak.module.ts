import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';
import { KeycloakConfigService } from './config.service';

@Module({
  imports: [HttpModule],
  providers: [KeycloakService, TokenService, KeycloakConfigService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
