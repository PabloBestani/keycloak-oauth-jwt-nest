import { Injectable } from '@nestjs/common';
import { AdminTokenData } from './definitions/interfaces';

@Injectable()
export class TokenService {
  private adminToken: string;
  private expirationDate: Date;

  constructor() {}

  private calculateExpirationDate(expiresIn: number): Date {
    const now = new Date();
    return new Date(now.getTime() + expiresIn * 1000);
  }

  getActiveAdminToken(): string | null {
    if (this.adminToken && new Date() < this.expirationDate) {
      return this.adminToken;
    }
    return null;
  }

  public updateTokenData({ access_token, expires_in }: AdminTokenData): void {
    if (!access_token)
      throw new Error('Access token not found (TokenService/updateTokenData)');
    if (!expires_in)
      throw new Error(
        'Expiration info not found (TokenService/updateTokenData)',
      );
    this.expirationDate = this.calculateExpirationDate(expires_in);
    this.adminToken = access_token;
  }
}
