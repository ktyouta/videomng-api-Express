import { FavoriteVideoCategoryTransaction, FavoriteVideoTransaction } from "@prisma/client";

export type UpdateFavoriteVideoResponseDataType = {
    readonly detail: FavoriteVideoTransaction,
    readonly category: FavoriteVideoCategoryTransaction[],
}