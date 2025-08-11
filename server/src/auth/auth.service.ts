import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async handleGoogleAuth(user: UserDTO): Promise<{ token: string }> {
    try {
      const userRecord = await this.userService.upsertUser(user);
      await this.workspaceService.ensurePersonalWorkspace(userRecord.id);
      const token = this.jwtService.sign({
        sub: userRecord.id,
        email: userRecord.email,
        avatar_url: userRecord.avatar_url,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'admin'],
          'x-hasura-default-role': 'user',
          'x-hasura-user-id': userRecord.id,
        },
      });
      return { token };
    } catch (error) {
      console.error('Error in handleGoogleAuth:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }
}
