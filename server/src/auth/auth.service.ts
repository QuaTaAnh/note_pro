import { Injectable } from '@nestjs/common';
import { HasuraService } from '../hasura/hasura.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasura: HasuraService,
    private readonly jwtService: JwtService,
  ) {}

  async handleGoogleAuth(user: UserDTO): Promise<{ token: string }> {
    const mutation = `
      mutation InsertUser($email: String!, $name: String!, $avatar_url: String!) {
        insert_users_one(
          object: { email: $email, name: $name, avatar_url: $avatar_url }
          on_conflict: { constraint: users_email_key, update_columns: [name, avatar_url] }
        ) {
          id
          email
          avatar_url
        }
      }
    `;

    const variables = {
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    };

    try {
      const data = await this.hasura.call<{
        insert_users_one: {
          id: string;
          email: string;
          avatar_url: string;
        } | null;
      }>(mutation, variables);

      const userInserted = data.insert_users_one;

      if (!userInserted) {
        throw new Error('Insert user failed');
      }

      const payload = {
        sub: userInserted.id,
        email: userInserted.email,
        avatar_url: userInserted.avatar_url,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'admin'],
          'x-hasura-default-role': 'user',
          'x-hasura-user-id': userInserted.id,
        },
      };

      const token = this.jwtService.sign(payload);

      return { token };
    } catch (error) {
      console.error('[AuthService] Failed to insert user:', error);
      throw error;
    }
  }

  handleLogout(email: string): void {
    try {
      console.log(`[AuthService] User logged out: ${email}`);
      // TODO: Add any logout cleanup logic here, e.g. update last_logout timestamp, invalidate sessions, etc.
    } catch (error) {
      console.error('[AuthService] Failed to handle logout:', error);
      throw error;
    }
  }
}
