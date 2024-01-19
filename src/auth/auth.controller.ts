import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KeycloakAdminService } from './keycloak-admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  @Post()
  async getAdminToken(): Promise<string> {
    return await this.keycloakAdminService.getAdminToken();
  }
}
