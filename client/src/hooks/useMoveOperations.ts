import { useMoveFolderMutation } from "@/graphql/mutations/__generated__/folder.generated";
import { FolderNode, moveFolderInTree } from "@/lib/folder";
import { useCallback } from "react";

interface UseMoveOperationsProps {
    folders: FolderNode[];
    setFolders: (folders: FolderNode[]) => void;
}
  
export const useMoveOperations = ({ 
    folders, 
    setFolders 
  }: UseMoveOperationsProps) => {
    const [moveFolderMutation] = useMoveFolderMutation()
  
    const moveFolder = useCallback(async ({
      folderId,
      targetId,
      position
    }: {
      folderId: string;
      targetId: string;
      position: 'before' | 'after' | 'inside';
    }) => {
      try {
        const updatedFolders = moveFolderInTree(folders, folderId, targetId, position);
        setFolders(updatedFolders);
  
        let newParentId: string | null = null;
        
        if (position === 'inside') {
          newParentId = targetId;
        } else {
          const findFolderParent = (folders: FolderNode[], folderId: string): string | null => {
            for (const folder of folders) {
              if (folder.children?.some(child => child.id === folderId)) {
                return folder.id;
              }
              if (folder.children) {
                const found = findFolderParent(folder.children, folderId);
                if (found !== undefined) return found;
              }
            }
            return null;
          };
          
          newParentId = findFolderParent(folders, targetId);
        }
  
        await moveFolderMutation({
          variables: {
            id: folderId,
            input: {
              parent_id: newParentId,
            }
          },
          optimisticResponse: {
            update_folders_by_pk: {
              __typename: 'folders',
              id: folderId,
              parent_id: newParentId,
            }
          }
        });
  
      } catch (error) {
        console.error('Failed to move folder:', error);
      }
    }, [folders, setFolders, moveFolderMutation]);

    return {
      moveFolder,
    };
};