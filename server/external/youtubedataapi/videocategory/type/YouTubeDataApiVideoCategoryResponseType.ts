import { YouTubeDataApiVideoCategorySnippetType } from "./YouTubeDataApiVideoCategorySnippetType";

export type YouTubeDataApiVideoCategoryResponseType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // カテゴリの一意のID
    readonly id: string;
    // カテゴリの詳細情報
    readonly snippet: YouTubeDataApiVideoCategorySnippetType;
};