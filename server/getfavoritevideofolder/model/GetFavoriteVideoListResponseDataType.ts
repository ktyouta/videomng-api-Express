import { FavoriteVideoTransaction, FolderMaster } from "@prisma/client"
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType"

export type GetFavoriteVideoFolderResponseDataType = {
    item: FavoriteVideoListMergedType[],
    total: number,
    page: number,
}