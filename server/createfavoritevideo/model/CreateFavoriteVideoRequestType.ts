
// お気に入り動画登録時のリクエストの型
export type CreateFavoriteVideoRequestType = {
    videoId: string,
    tagList?: number[],
    folderId?: number;
}