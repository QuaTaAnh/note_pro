import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  private isGoogleConfigured(): boolean {
    return !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CALLBACK_URL &&
      process.env.JWT_SECRET
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    if (!this.isGoogleConfigured()) {
      throw new HttpException(
        {
          statusCode: 503,
          message: 'Google OAuth is not configured',
          error: 'Service Unavailable',
          details:
            'Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Will be handled by AuthGuard('google') which redirects to Google
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!this.isGoogleConfigured()) {
      throw new HttpException(
        {
          statusCode: 503,
          message: 'Google OAuth is not configured',
          error: 'Service Unavailable',
          details:
            'Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const user = req.user as { email: string; name: string; avatar: string };

      if (!user || !user.email) {
        throw new HttpException(
          {
            statusCode: 401,
            message: 'User not authenticated',
            error: 'Unauthorized',
            details: 'No user information received from Google OAuth',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Create JWT token for Hasura
      const token = jwt.sign(
        {
          sub: user.email,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': user.email,
          },
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' },
      );

      // Redirect to client frontend with token
      res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      throw new HttpException(
        {
          statusCode: 500,
          message: 'Authentication callback failed',
          error: 'Internal Server Error',
          details: 'Google authentication callback could not be processed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  getAuthStatus() {
    return {
      google: {
        configured: this.isGoogleConfigured(),
        message: this.isGoogleConfigured()
          ? 'Google OAuth is configured and ready'
          : 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
      },
    };
  }
}
