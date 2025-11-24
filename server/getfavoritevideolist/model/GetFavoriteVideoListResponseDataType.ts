import { FavoriteVideoTransaction, FolderMaster } from "@prisma/client"
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType"

export type GetFavoriteVideoListResponseDataType = {
    item: FavoriteVideoListMergedType[],
    total: number,
    page: number,
    folder: FolderMaster[]
}