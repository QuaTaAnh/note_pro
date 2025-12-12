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
