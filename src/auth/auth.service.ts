import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { RegisterUserDto } from './dto/register-user.dto';
import { convertJwtExpiresInToNumber } from '../utils/helpers';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const include: Prisma.UserInclude = { region: { include: { country: true } } };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  register(registerUserDto: RegisterUserDto) {
    // Filter out passwordConfirm from registerUserDto
    const { passwordConfirm, ...rest } = registerUserDto;

    // Get expiresIn value from env variable
    const expiresIn = this.configService.get<string>('JWT_EXPIRE');

    // Generate confirmation code
    const confirmationCode = jwt.sign(
      { email: rest.email },
      this.configService.get('JWT_SECRET'),
      { expiresIn },
    );

    // Calculate confirmation code expiry date
    const confirmationCodeExpiryDate = add(new Date(), {
      days: convertJwtExpiresInToNumber(expiresIn),
    });

    return this.prisma.user.create({
      data: { ...rest, confirmationCode, confirmationCodeExpiryDate },
      include,
    });
  }

  async login({ email, password }: LoginDto) {
    // Check if the user with the given email exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is verified and not blocked
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Your account is not active, please verify your email',
      );
    }

    // Password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const { id, role } = user;

    const token = jwt.sign(
      { id, role },
      this.configService.get<string>('JWT_SECRET'),
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRE'),
      },
    );

    const decoded = jwt.verify(
      token,
      this.configService.get<string>('JWT_SECRET'),
    );

    return {
      user,
      token,
      expiresIn: typeof decoded !== 'string' ? decoded.exp : null,
    };
  }
}
