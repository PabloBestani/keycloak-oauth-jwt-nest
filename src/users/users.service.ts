import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private keycloakUrl: string;
  private adminToken: string;

  constructor(
    // private httpService:
    private readonly configService: ConfigService,
  ) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
  }
}
