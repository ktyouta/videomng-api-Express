import { FavoriteVideoCategoryTransaction, FavoriteVideoTransaction } from "@prisma/client";

export type UpdateFavoriteVideoCustomResponseDataType = {
    readonly detail: FavoriteVideoTransaction,
    readonly category: FavoriteVideoCategoryTransaction[],
}