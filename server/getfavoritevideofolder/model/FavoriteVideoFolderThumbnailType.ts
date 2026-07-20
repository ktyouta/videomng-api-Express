import { ThumbnailType } from "../../types/ThumbnailType";
import { FavoriteVideoFolderType } from "./FavoriteVideoFolderType";

export type FavoriteVideoFolderThumbnailType = Omit<FavoriteVideoFolderType, "videoId"> & {
    thumbnails?: ThumbnailType
};