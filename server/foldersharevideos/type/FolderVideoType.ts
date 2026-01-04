import { FavoriteVideoTransaction } from "@prisma/client";
import { FolderInfoType } from "./FolderInfoType";

export type FolderVideoType = FavoriteVideoTransaction & {
    folder: FolderInfoType[]
}