import { YouTubeDataApiPlaylistItemType } from "./YouTubeDataApiPlaylistItemType";

export type YouTubeDataApiPlaylistResponseType = {
  // レスポンスの種類（例: "youtube#playlistItemListResponse"）
  readonly kind: string;
  // レスポンスのETag（キャッシュ制御等に使用）
  readonly etag: string;
  // 次ページ取得用トークン（ページネーション用）
  readonly nextPageToken?: string;
  // ページ情報（全件数・1ページあたりの件数）
  readonly pageInfo: {
    // 総件数（プレイリストに含まれる動画数）
    totalResults: number;
    // 1ページあたりの取得件数
    resultsPerPage: number;
  };
  // プレイリスト内の動画リスト
  readonly items: YouTubeDataApiPlaylistItemType[];
};
