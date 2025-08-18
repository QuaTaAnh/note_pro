import { NewFolderButton } from "./NewFolderButton";

export const FolderMenu = () => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium">Folders</span>
      <NewFolderButton />
    </div>
  );
};
