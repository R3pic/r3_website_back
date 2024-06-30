import { Module } from '@nestjs/common';
import { JwtRefreshStretagy } from './auth/jwt-refresh.strategy';
import { JwtAccessStrategy } from './auth/jwt-access.strategy';

@Module({
  imports: [],
  providers: [JwtRefreshStretagy, JwtAccessStrategy],
  exports: [JwtRefreshStretagy, JwtAccessStrategy],
})
export class CommonModule {}
