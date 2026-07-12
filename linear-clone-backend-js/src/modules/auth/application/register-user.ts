import { z } from 'zod';
import bcrypt from 'bcrypt';
import { UserRepository } from './ports/user-repository';
import { TokenService } from './ports/token-service';
import { EventPublisher } from './ports/event-publisher';

export const RegisterUserInput = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterUserInputType = z.infer<typeof RegisterUserInput>;

export interface RegisterUserOutput {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: RegisterUserInputType): Promise<RegisterUserOutput> {
    // Validate input
    const validatedInput = RegisterUserInput.parse(input);

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(validatedInput.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedInput.password, 12);

    // Create user
    const user = await this.userRepository.create({
      email: validatedInput.email,
      name: validatedInput.name,
      passwordHash,
    });

    // Generate tokens
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    // Emit event
    await this.eventPublisher.publish({
      type: 'UserRegistered',
      userId: user.id,
      timestamp: new Date(),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
