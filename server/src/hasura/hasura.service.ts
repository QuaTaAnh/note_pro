import { Injectable } from '@nestjs/common';

@Injectable()
export class HasuraService {
  async call<T>(query: string, variables: Record<string, any>): Promise<T> {
    const response = await fetch(`${process.env.HASURA_GRAPHQL_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    type GraphQLResponse<T> = {
      data?: T;
      errors?: unknown;
    };

    const data = (await response.json()) as GraphQLResponse<T>;

    if (data.errors) {
      console.error('[HasuraService] GraphQL error:', data.errors);
      throw new Error('Hasura query failed');
    }

    if (data.data === undefined) {
      throw new Error('Hasura query did not return data');
    }

    return data.data;
  }
}
