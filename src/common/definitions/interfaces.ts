export interface KeycloakUserInterface {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  email: string;
  disableablCredentialTypes: [];
  requiredActions: [];
  notBefore: number;
  access: boolean[];
}
