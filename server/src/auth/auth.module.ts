import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
