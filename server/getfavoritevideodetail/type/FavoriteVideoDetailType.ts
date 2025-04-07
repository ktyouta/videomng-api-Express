import { FavoriteVideoCategoryTransaction, FavoriteVideoTransaction } from "@prisma/client";

export type FavoriteVideoDetailType = FavoriteVideoTransaction & {
    viewStatusName: string,
}