import { FavoriteVideoTagTransaction, TagMaster } from "@prisma/client";

export type FavoriteVideoTagType = FavoriteVideoTagTransaction & {
    tagName: string,
}