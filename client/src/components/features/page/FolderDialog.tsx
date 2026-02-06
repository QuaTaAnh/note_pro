import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { IconPicker } from '@/components/ui/icon-picker';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useRef, useState } from 'react';

export enum FolderMode {
    CREATE = 'create',
    UPDATE = 'update',
}

interface FolderData {
    name: string;
    description: string;
    icon: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: FolderMode;
    initialData?: Partial<FolderData>;
    onSubmit: (data: FolderData) => Promise<void>;
}

export const IconDefault = '📁';

export const FolderDialog = ({
    open,
    onOpenChange,
    mode,
    initialData,
    onSubmit,
}: Props) => {
    const [folderData, setFolderData] = useState<FolderData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        icon: initialData?.icon || IconDefault,
    });
    const dialogContentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open && initialData) {
            setFolderData({
                name: initialData.name || '',
                description: initialData.description || '',
                icon: initialData.icon || IconDefault,
            });
        }
    }, [open, initialData]);

    const handleInputChange = (
        field: keyof FolderData,
        value: string | React.ComponentType<unknown>
    ) => {
        setFolderData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        await onSubmit(folderData);
        if (mode === FolderMode.CREATE) {
            setFolderData({
                name: '',
                description: '',
                icon: IconDefault,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                ref={dialogContentRef}
                className="sm:max-w-[400px] shadow-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === FolderMode.CREATE
                            ? 'Create New Folder'
                            : 'Edit'}
                    </DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <InputField
                            id="title"
                            placeholder="Folder Name"
                            value={folderData.name}
                            onChange={(e) =>
                                handleInputChange('name', e.target.value)
                            }
                            className="placeholder:text-muted-foreground focus:ring-0 bg-card"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="description"
                            className="text-sm font-medium">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter folder description..."
                            value={folderData.description}
                            onChange={(e) =>
                                handleInputChange('description', e.target.value)
                            }
                            className="placeholder:text-muted-foreground focus:ring-0 resize-none h-20 bg-card"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Icon</Label>
                        <IconPicker
                            selectedIcon={folderData.icon}
                            onIconChange={(icon) =>
                                handleInputChange('icon', icon)
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={!folderData.name.trim()}
                        className="w-full h-9 bg-primary-button rounded-lg hover:bg-primary-buttonHover font-medium">
                        {mode === FolderMode.CREATE ? 'Create' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
