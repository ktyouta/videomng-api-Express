import { ThumbnailType } from "../../common/type/ThumbnailType";
import { FavoriteVideoFolderType } from "./FavoriteVideoFolderType";

export type FavoriteVideoFolderThumbnailType = FavoriteVideoFolderType & {
    thumbnails?: ThumbnailType
};