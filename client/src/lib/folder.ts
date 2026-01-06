import keyBy from 'lodash/keyBy';
import partition from 'lodash/partition';

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
    // Create a map of folders with children array using lodash
    const map = keyBy(
        folders.map((folder) => ({ ...folder, children: [] as FolderNode[] })),
        'id'
    );

    // Partition folders into root and child folders
    const [childFolders, rootFolders] = partition(
        Object.values(map),
        (folder) => folder.parent_id
    );

    // Attach children to their parents
    childFolders.forEach((folder) => {
        const parent = map[folder.parent_id!];
        if (parent && parent.children) {
            parent.children.push(folder);
        }
    });

    return rootFolders;
};
