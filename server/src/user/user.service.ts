import { Injectable } from '@nestjs/common';
import { HasuraService } from '../hasura/hasura.service';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly hasura: HasuraService) {}

  async upsertUser(
    user: UserDTO,
  ): Promise<{ id: string; email: string; avatar_url: string }> {
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

    const result = await this.hasura.call<{
      insert_users_one: {
        id: string;
        email: string;
        avatar_url: string;
      } | null;
    }>(mutation, variables);
    if (!result.insert_users_one) throw new Error('Upsert user failed');

    return result.insert_users_one;
  }
}
