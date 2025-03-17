// お気に入り動画メモ更新時のリクエストの型
export type UpdateFavoriteVideoMemoRequestType = {
    videoId: string,
    videoMemoSeq: number,
    memo: string,
}