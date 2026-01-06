'use client';

import { LayoutEditor, LeftSidebar } from '@/components/layouts/editor-layout';
import TiptapBlockEditor from '@/components/features/editor/TiptapBlockEditor';
import { DocumentAccessGuard } from '@/components/features/auth/DocumentAccessGuard';
import { useParams } from 'next/navigation';

export default function EditorPage() {
    const { params } = useParams();
    const documentId = params?.[params.length - 1];

    return !documentId ? null : (
        <DocumentAccessGuard documentId={documentId}>
            <LayoutEditor left={<LeftSidebar pageId={documentId} />}>
                <TiptapBlockEditor pageId={documentId} className="w-full " />
            </LayoutEditor>
        </DocumentAccessGuard>
    );
}
