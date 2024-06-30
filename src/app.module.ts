import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { CommonModule } from './commons/common.module';
import { PostModule } from './api/post/post.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PrismaModule, AuthModule, CommonModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
