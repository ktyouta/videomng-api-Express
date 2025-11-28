import { FolderMaster } from "@prisma/client";
import { FavoriteVideoFolderType } from "./FavoriteVideoFolderType";
import { ThumbnailType } from "../../common/type/ThumbnailType";

export type FavoriteVideoFolderThumbnailType = FavoriteVideoFolderType & {
    thumbnails?: ThumbnailType
};