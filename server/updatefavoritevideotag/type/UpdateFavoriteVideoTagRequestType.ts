import { UpdateFavoriteVideoTagType } from "./UpdateFavoriteVideoTagType";

// お気に入り動画タグ更新時のリクエストの型
export type UpdateFavoriteVideoTagRequestType = {
    readonly tag: UpdateFavoriteVideoTagType,
}