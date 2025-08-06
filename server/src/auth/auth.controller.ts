import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() body: UserDTO): Promise<{ token: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return await this.authService.handleGoogleAuth(body);
    } catch {
      throw new Error('Failed to authenticate with Google');
    }
  }

  @Post('logout')
  logout(@Body() body: { email: string }): { success: boolean } {
    try {
      this.authService.handleLogout(body.email);
      return { success: true };
    } catch {
      throw new Error('Failed to logout');
    }
  }
}
