// お気に入り動画更新時のリクエストの型
export type UpdateFavoriteVideoCustomRequestType = {
    summary: string,
    viewStatus: string,
    category: string[],
    favoriteLevel: number,
    isVisibleAfterFolderAdd: string,
}