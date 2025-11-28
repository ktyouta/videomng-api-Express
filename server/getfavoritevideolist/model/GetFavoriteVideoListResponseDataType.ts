import { FavoriteVideoTransaction, FolderMaster } from "@prisma/client"
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType"
import { FavoriteVideoFolderThumbnailType } from "./FavoriteVideoFolderThumbnailType"

export type GetFavoriteVideoListResponseDataType = {
    item: FavoriteVideoListMergedType[],
    total: number,
    page: number,
    folder: FavoriteVideoFolderThumbnailType[]
}