import { YouTubeDataApiItemType } from "./YouTubeDataApiItemType";

//YouTube Data Api(動画リスト)のレスポンス
export type YouTubeDataApiVideoListResponseType = {
    readonly kind: string;
    readonly etag: string;
    readonly nextPageToken?: string;
    readonly regionCode?: string;
    readonly pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    readonly items: YouTubeDataApiItemType[];
};
