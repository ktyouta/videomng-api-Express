// お気に入り動画更新時のリクエストの型
export type UpdateFavoriteVideoRequestType = {
    summary: string,
    viewStatus: string,
    category: string[],
}