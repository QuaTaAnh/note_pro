export interface FolderNode {
    id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parent_id?: string | null;
    children?: FolderNode[];
  }
  
export const buildTree = (folders: FolderNode[]): FolderNode[] => {
    const map = new Map<string, FolderNode>();
  
    folders.forEach((folder) => map.set(folder.id, { ...folder, children: [] }));
  
    const tree: FolderNode[] = [];
  
    map.forEach((folder) => {
      if (folder.parent_id) {
        const parent = map.get(folder.parent_id);
        if (parent) {
          parent.children!.push(folder);
        }
      } else {
        tree.push(folder);
      }
    });
  
    return tree;
  };

export function moveFolderInTree(
  folders: FolderNode[],
  draggedId: string,
  targetId: string,
  position: 'before' | 'after' | 'inside'
): FolderNode[] {
  const newFolders = JSON.parse(JSON.stringify(folders)); 
  
  const draggedFolder = findAndRemoveFolder(newFolders, draggedId);
  if (!draggedFolder) return folders;
  insertFolder(newFolders, draggedFolder, targetId, position);
  
  return newFolders;
}

function findAndRemoveFolder(folders: FolderNode[], id: string): FolderNode | null {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === id) {
      return folders.splice(i, 1)[0];
    }
    
    if (folders[i].children) {
      const found = findAndRemoveFolder(folders[i].children!, id);
      if (found) return found;
    }
  }
  return null;
}

function insertFolder(
  folders: FolderNode[],
  folder: FolderNode,
  targetId: string,
  position: 'before' | 'after' | 'inside'
): boolean {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === targetId) {
      if (position === 'before') {
        folders.splice(i, 0, folder);
      } else if (position === 'after') {
        folders.splice(i + 1, 0, folder);
      } else if (position === 'inside') {
        if (!folders[i].children) {
          folders[i].children = [];
        }
        folder.parent_id = targetId;
        folders[i].children!.push(folder);
      }
      return true;
    }
    
    if (folders[i].children) {
      if (insertFolder(folders[i].children!, folder, targetId, position)) {
        return true;
      }
    }
  }
  return false;
}
  