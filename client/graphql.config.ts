import dotenv from 'dotenv';
import type { IGraphQLConfig } from 'graphql-config';
import type { Types } from '@graphql-codegen/plugin-helpers';

dotenv.config({
    path: '.env',
    override: true,
});

const codegenConfig: Types.Config = {
    overwrite: true,
    generates: {
        './src/generated/graphql.ts': {
            plugins: ['typescript'],
            config: createCodegenPluginConfig(false),
        },
        './src': {
            preset: 'near-operation-file',
            presetConfig: {
                extension: '.generated.tsx',
                baseTypesPath: '~generated/graphql',
                folder: '__generated__',
            },
            plugins: ['typescript-operations', 'typescript-react-apollo'],
            config: createCodegenPluginConfig(true),
        },
        './src/generated/apollo-helpers.ts': {
            plugins: ['typescript-apollo-client-helpers'],
        },
    },
};

const config: IGraphQLConfig = {
    schema: [
        {
            [`${process.env.NEXT_PUBLIC_HASURA_SERVER_ENDPOINT}/v1/graphql`]: {
                headers: {
                    'X-Hasura-Admin-Secret': String(
                        process.env.HASURA_GRAPHQL_ADMIN_SECRET
                    ),
                },
            },
        },
    ],
    documents: './src/**/*.graphql',
    extensions: {
        codegen: codegenConfig,
    },
};

/**
 * @param {boolean} withHooks
 *
 * @returns {import('@graphql-codegen/typescript-react-apollo/typings/config').ReactApolloRawPluginConfig}
 */
function createCodegenPluginConfig(withHooks: boolean) {
    return {
        withHooks,
        withFragmentHooks: withHooks,
        namingConvention: {
            typeNames: 'change-case#pascalCase',
            transformUnderscore: true,
        },
        strictScalars: true,
        scalars: {
            Date: 'string',
            DateTime: 'string',
            JSONObject: 'any',
            UUID: 'string',
            bigint: 'number',
            date: 'string',
            inet: 'string',
            json: 'any',
            jsonb: 'any',
            numeric: 'number',
            oid: 'number',
            smallint: 'number',
            timestamp: 'string',
            timestamptz: 'string',
            uuid: 'string',
            time: 'string',
            timetz: 'string',
        },
        defaultBaseOptions: {
            /**
             * Skip updating mutation and subscription results by default to minimize rerenders.
             *
             * We rarely interact with this declarative `useMutation` hook result in favor of
             * the imperative mutate function's promise result.
             *
             * As of Apollo Client v3.11 this option affects `useSubscription` hooks as well.
             *
             * @see https://www.apollographql.com/docs/react/data/mutations/#ignoreresults
             * @see https://www.apollographql.com/docs/react/data/subscriptions/#subscriptionhookoptions-interface-ignoreresults
             */
            ignoreResults: true,
        },
    };
}

export default config;