import { FavoriteVideoFolderTransaction } from "@prisma/client";

export type FavoriteVideoFolderType = FavoriteVideoFolderTransaction & {
    folderName: string,
    parentId: number,
}