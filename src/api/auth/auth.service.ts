import { ConflictException, Injectable } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { LoginDto, SignupDto } from 'src/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ user_id, nickname, password }: SignupDto): Promise<UserModel> {
    console.log(`user_id: ${user_id}, nickname: ${nickname}, password: ${password}`);
    console.log(`PASSWORD_SALT_ROUNDS: ${this.PASSWORD_SALT_ROUNDS}`);
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, this.PASSWORD_SALT_ROUNDS);
    return this.prisma.user.create({
      data: {
        user_id,
        nickname,
        password: hashedPassword,
      },
    });
  }

  async login({ user_id, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new ConflictException('존재하지 않는 아이디입니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }

    return user;
  }

  getAccessToken({ user }: UserInterface): string {
    return this.jwtService.sign(
      {
        user_id: user.user_id,
        nickname: user.nickname,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1m',
      },
    );
  }

  getRefreshToken({ user }: UserInterface): string {
    return this.jwtService.sign(
      {
        user_id: user.user_id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );
  }
}
