import { Injectable } from '@nestjs/common';
import { HasuraService } from '../hasura/hasura.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly hasura: HasuraService) {}

  async ensurePersonalWorkspace(userId: string): Promise<{ id: string }> {
    const mutation = `
      mutation CreateWorkspaceIfNotExists($userId: uuid!) {
        insert_workspaces_one(
          object: {
            name: "My Space",
            created_by: $userId
          },
          on_conflict: {
            constraint: workspaces_created_by_key,
            update_columns: [name]
          }
        ) {
          id
        }
      }
    `;

    const { insert_workspaces_one } = await this.hasura.call<{
      insert_workspaces_one: { id: string };
    }>(mutation, { userId });

    return insert_workspaces_one;
  }
}
