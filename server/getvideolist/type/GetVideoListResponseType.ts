import { YouTubeDataApiVideoListItemType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType";
import { GetVideoListItemType } from "./GetVideoListItemType";

export type GetVideoListResponseType = {
    readonly kind: string;
    readonly etag: string;
    readonly nextPageToken?: string;
    readonly regionCode?: string;
    readonly pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    readonly items: GetVideoListItemType[];
}