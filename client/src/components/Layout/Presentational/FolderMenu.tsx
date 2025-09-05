import { useGetFoldersQuery } from "@/graphql/queries/__generated__/folder.generated";
import { NewFolderButton } from "./NewFolderButton";
import { useWorkspace } from "@/hooks/use-workspace";
import { buildTree, FolderNode } from "@/lib/folder";
import { FolderItem } from "@/components/page/FolderItem";
import { PageLoading } from "@/components/ui/loading";

export const FolderMenu = () => {
  const { workspace, workspaceSlug } = useWorkspace();
  const { data, loading } = useGetFoldersQuery({
    variables: { workspaceId: workspace?.id ?? "" },
    skip: !workspace?.id,
  });

  const folders = data?.folders ?? [];
  const tree = buildTree(folders as FolderNode[]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium">Folders</span>
        <NewFolderButton />
      </div>
      {loading ? (
        <PageLoading />
      ) : (
        <div className="space-y-1">
          {tree.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
};
