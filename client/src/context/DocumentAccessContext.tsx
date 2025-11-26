"use client";

import { createContext, useContext, useState } from "react";

interface DocumentAccessContextType {
  hasAccess: boolean;
  setHasAccess: (hasAccess: boolean) => void;
  documentId: string | null;
  setDocumentId: (documentId: string | null) => void;
}

const DocumentAccessContext = createContext<
  DocumentAccessContextType | undefined
>(undefined);

export function DocumentAccessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasAccess, setHasAccess] = useState(true);
  const [documentId, setDocumentId] = useState<string | null>(null);

  return (
    <DocumentAccessContext.Provider
      value={{ hasAccess, setHasAccess, documentId, setDocumentId }}
    >
      {children}
    </DocumentAccessContext.Provider>
  );
}

export function useDocumentAccess() {
  const context = useContext(DocumentAccessContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentAccess must be used within a DocumentAccessProvider"
    );
  }
  return context;
}
