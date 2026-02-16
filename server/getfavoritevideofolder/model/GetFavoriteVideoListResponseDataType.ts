import { FavoriteVideoFolderThumbnailType } from "./FavoriteVideoFolderThumbnailType"
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType"

export type GetFavoriteVideoFolderResponseDataType = {
    item: FavoriteVideoListMergedType[],
    total: number,
    page: number,
    folder: FavoriteVideoFolderThumbnailType[],
}