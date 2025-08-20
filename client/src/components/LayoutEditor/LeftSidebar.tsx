import { CheckCircle, Menu, Paperclip, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { formatDate } from "@/lib/utils";

interface Props {
  documentName: string | undefined;
  createdAt: string | undefined | null;
}

export const LeftSidebar = ({ documentName, createdAt }: Props) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-sidebar-header">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="text-xs font-medium">{documentName}</h2>
          </div>
          <span className="text-xs">
            {formatDate(createdAt || "", { relative: true })}
          </span>
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
