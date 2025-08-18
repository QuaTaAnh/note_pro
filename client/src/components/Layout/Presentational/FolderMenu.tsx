import { useGetFoldersQuery } from "@/graphql/queries/__generated__/folder.generated";
import { NewFolderButton } from "./NewFolderButton";
import { useWorkspace } from "@/hooks/use-workspace";
import { buildTree, FolderNode } from "@/lib/folder";
import { FolderItem } from "@/components/page/FolderItem";

export const FolderMenu = () => {
  const { workspace } = useWorkspace();
  const { data, loading, error } = useGetFoldersQuery({
    variables: { workspaceId: workspace?.id ?? "" },
    skip: !workspace?.id,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading folders</div>;

  const folders = data?.folders ?? [];
  const tree = buildTree(folders as FolderNode[]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium">Folders</span>
        <NewFolderButton />
      </div>

      <div className="space-y-1">
        {tree.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
};
