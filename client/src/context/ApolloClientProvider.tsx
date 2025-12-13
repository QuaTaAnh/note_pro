"use client";

import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";

export function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
