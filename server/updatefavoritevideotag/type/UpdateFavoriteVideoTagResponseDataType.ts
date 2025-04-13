import { FavoriteVideoTagTransaction } from "@prisma/client";

export type FavoriteVideoTagType = FavoriteVideoTagTransaction & {
    tagName: string,
}