import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';

// Conditionally include GoogleStrategy only if Google OAuth is configured
const conditionalProviders: any[] = [];
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL
) {
  conditionalProviders.push(GoogleStrategy);
}

@Module({
  controllers: [AuthController],
  providers: conditionalProviders,
})
export class AuthModule {}
