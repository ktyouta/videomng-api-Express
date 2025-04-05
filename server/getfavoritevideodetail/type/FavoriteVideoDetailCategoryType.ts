import { FavoriteVideoCategoryTransaction } from "@prisma/client";

export type FavoriteVideoDetailCategoryType = FavoriteVideoCategoryTransaction & {
    categoryName: string,
}