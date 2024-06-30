import { Controller, Body, Post, ConflictException, Res, Req, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from 'src/dto/auth.dto';
import { UserService } from 'src/api/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserInterface } from 'src/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<UserModel> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() { user_id, password }: LoginDto, @Res() res: Response) {
    const user = await this.userService.getUser({ user_id: user_id });

    if (!user) {
      throw new ConflictException('존재하지 않는 아이디입니다.');
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }

    const refreshToken = this.authService.getRefreshToken({ user });
    const accessToken = this.authService.getAccessToken({ user });

    res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    return res.status(200).send({ message: '토큰이 발급되었습니다.' });
  }

  @UseGuards(AuthGuard('access'))
  @UseGuards(AuthGuard('refresh'))
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.setHeader('Authorization', '');
    return res.status(200).send({ message: '로그아웃 되었습니다.' });
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  async restoreAccessToken(@Req() req: Request & UserInterface, @Res() res: Response) {
    const user = req.user;
    const accessToken = this.authService.getAccessToken({ user });

    res.cookie('accessToken', accessToken);
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return res.status(200).send({ message: '토큰이 재발급되었습니다.' });
  }

  // @Delete('withdraw')
  // async withdraw(@Body() user_id: string) {
  //   return this.authService.withdraw(user_id);
  // }
}
