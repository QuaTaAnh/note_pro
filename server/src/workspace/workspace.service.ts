import { Injectable } from '@nestjs/common';
import { HasuraService } from '../hasura/hasura.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly hasura: HasuraService) {}

  async ensurePersonalWorkspace(userId: string): Promise<void> {
    const query = `
      query GetWorkspaceByUserId($userId: uuid!) {
        workspaces(where: { created_by: { _eq: $userId } }) {
          id
        }
      }
    `;
    const { workspaces } = await this.hasura.call<{
      workspaces: { id: string }[];
    }>(query, { userId });

    if (workspaces.length === 0) {
      const mutation = `
        mutation CreateWorkspace($userId: uuid!) {
          insert_workspaces_one(
            object: {
              name: "My Space",
              created_by: $userId
            }
          ) {
            id
          }
        }
      `;
      await this.hasura.call(mutation, { userId });
    }
  }
}
