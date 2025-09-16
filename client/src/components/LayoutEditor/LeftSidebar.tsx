import { CheckCircle, Menu, Paperclip, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { formatDate } from "@/lib/utils";
import { useDocumentBlocks } from "@/hooks";
import { getPlainText } from "../page/CardDocument";
import Image from "next/image";

interface Props {
  pageId: string;
}

export const LeftSidebar = ({ pageId }: Props) => {
  const { rootBlock } = useDocumentBlocks(pageId);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <div className="flex flex-row items-center gap-2 mb-3">
          <Image 
            src="/images/document-icon.png" 
            alt="Document" 
            width={36} 
            height={36} 
            className="h-9 w-9 shrink-0" 
          />

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">
              {getPlainText(rootBlock?.content?.title) || "Untitled"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {formatDate(rootBlock?.updated_at || "", { relative: true })}
            </span>
          </div>
        </div>

        <Tabs defaultValue="contents" className="w-full">
          <TabsList className="grid grid-cols-4 gap-1">
            <TabsTrigger value="contents">
              <Menu className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <CheckCircle className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="attachments">
              <Paperclip className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="find">
              <Search className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 py-2 overflow-y-auto">
            <TabsContent value="contents" className="text-sm">
              Menu content here
            </TabsContent>
            <TabsContent value="tasks" className="text-sm">
              CheckCircle content here
            </TabsContent>
            <TabsContent value="attachments" className="text-sm">
              Attachments content here
            </TabsContent>
            <TabsContent value="find" className="text-sm">
              Search content here
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
