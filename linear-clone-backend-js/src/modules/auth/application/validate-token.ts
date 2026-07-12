import { TokenService } from './ports/token-service';

export interface ValidateTokenInput {
  token: string;
}

export interface ValidateTokenOutput {
  valid: boolean;
  userId?: string;
  expiresAt?: Date;
}

export class ValidateToken {
  constructor(private tokenService: TokenService) {}

  async execute(input: ValidateTokenInput): Promise<ValidateTokenOutput> {
    try {
      const result = await this.tokenService.verifyAccessToken(input.token);
      return {
        valid: true,
        userId: result.userId,
        expiresAt: result.expiresAt,
      };
    } catch {
      return {
        valid: false,
      };
    }
  }
}
