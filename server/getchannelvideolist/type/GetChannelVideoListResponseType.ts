import { GetChannelVideoChannelInfoType } from "./GetChannelVideoChannelInfoType";
import { GetChannelVideoListItemType } from "./GetChannelVideoListItemType";

export type GetChannelVideoListResponseType = {
    readonly kind: string;
    readonly etag: string;
    readonly nextPageToken?: string;
    readonly regionCode?: string;
    readonly pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    readonly channelInfo: GetChannelVideoChannelInfoType,
    readonly items: GetChannelVideoListItemType[];
}