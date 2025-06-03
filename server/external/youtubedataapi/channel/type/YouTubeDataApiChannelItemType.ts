// チャンネルごとのデータ
export type YouTubeDataApiChannelItemType = {
    // 各チャンネルアイテムの種類（例: "youtube#channel"）
    readonly kind: string;
    // 各チャンネルのETag
    readonly etag: string;
    // チャンネルID（指定したIDと一致）
    readonly id: string;
    // チャンネルに関連するプレイリスト情報
    readonly contentDetails: {
        readonly relatedPlaylists: {
            // チャンネルが「高評価」した動画のプレイリストID
            readonly likes: string;
            // チャンネルがお気に入りに登録した動画のプレイリストID（省略される場合あり）
            readonly favorites?: string;
            // チャンネルがアップロードした動画のプレイリストID
            readonly uploads: string;
            // 視聴履歴（ユーザー自身のみに見える。通常は取得不可）
            readonly watchHistory?: string;
            // 後で見るに登録したプレイリストID（非公開）
            readonly watchLater?: string;
        };
    };
    // チャンネル情報
    readonly snippet: {
        readonly title: string,
        readonly thumbnails: {
            readonly high: {
                readonly url: string,
            }
        }
    }
};