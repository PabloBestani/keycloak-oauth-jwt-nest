import { Injectable } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class TokenService {
  private adminToken: string;
  private expirationDate: Date;

  constructor(private readonly keycloakService: KeycloakService) {}

  private calculateExpirationDate(expiresIn: number): Date {
    const now = new Date();
    return new Date(now.getTime() + expiresIn * 1000);
  }

  async getAdminToken(): Promise<string> {
    if (this.adminToken && new Date() < this.expirationDate) {
      return Promise.resolve(this.adminToken);
    }
    const newTokenData = await this.keycloakService.getAdminTokenData();
    const { access_token, expires_in } = newTokenData;
    this.expirationDate = this.calculateExpirationDate(expires_in);
    return access_token;
  }
}
