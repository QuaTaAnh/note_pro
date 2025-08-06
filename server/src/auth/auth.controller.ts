import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() body: UserDTO): Promise<{
    token: string;
    workspaceSlug: string;
  }> {
    try {
      return await this.authService.handleGoogleAuth(body);
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error(
        `Failed to authenticate with Google: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
