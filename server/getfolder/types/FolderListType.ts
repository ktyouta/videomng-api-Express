export type FolderListType = {
    name: string;
    userId: number;
    createDate: Date;
    updateDate: Date;
    id: number;
    parentId: number | null;
    folderColor: string | null;
}