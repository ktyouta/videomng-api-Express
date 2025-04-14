import { FavoriteVideoTagTransaction } from "@prisma/client";

export type UpdateFavoriteVideoTagResponseDataType = FavoriteVideoTagTransaction & {
    tagName: string,
}