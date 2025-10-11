import { FavoriteVideoTransaction } from "@prisma/client"

export type GetFavoriteVideoListResponseDataType = {
    item: FavoriteVideoTransaction[],
    total: number,
    page: number,
}