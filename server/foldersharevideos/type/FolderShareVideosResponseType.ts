import { FavoriteVideoTransaction } from "@prisma/client";
import { FolderInfoType } from "./FolderInfoType";

export type FolderShareVideosResponseType = FavoriteVideoTransaction & {
    videoTitle: string,
    folder: FolderInfoType[]
}