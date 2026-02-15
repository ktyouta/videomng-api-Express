import { FolderMaster } from "@prisma/client";

export type FavoriteVideoFolderType = FolderMaster & {
    latestVideoId: string,
}

