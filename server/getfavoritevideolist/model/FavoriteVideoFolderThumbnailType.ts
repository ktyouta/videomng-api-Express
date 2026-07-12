import { ThumbnailType } from "../../types/ThumbnailType";
import { FavoriteVideoFolderType } from "./FavoriteVideoFolderType";

export type FavoriteVideoFolderThumbnailType = FavoriteVideoFolderType & {
    thumbnails?: ThumbnailType
};