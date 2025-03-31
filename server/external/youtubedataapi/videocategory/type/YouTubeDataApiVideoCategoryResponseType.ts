import { YouTubeDataApiVideoCategoryItemType } from "./YouTubeDataApiVideoCategoryItemType";
import { YouTubeDataApiVideoCategorySnippetType } from "./YouTubeDataApiVideoCategorySnippetType";

export type YouTubeDataApiVideoCategoryResponseType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // カテゴリ情報
    readonly items: YouTubeDataApiVideoCategoryItemType[],
};