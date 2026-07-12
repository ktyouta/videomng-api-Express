import { FavoriteVideoTagInputType } from "./FavoriteVideoTagInputType";

// お気に入り動画タグ更新時のリクエストの型
export type UpdateFavoriteVideoTagRequestType = {
    readonly tag: FavoriteVideoTagInputType[],
}