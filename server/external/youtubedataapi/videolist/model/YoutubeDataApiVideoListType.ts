export type YoutubeDataApiVideoListType = {
    readonly kind: string;
    readonly etag: string;
    readonly nextPageToken?: string;
    readonly regionCode?: string;
    readonly pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    readonly items: {
        kind: string;
        etag: string;
        id: {
            kind: string;
            videoId?: string;
            channelId?: string;
            playlistId?: string;
        };
        snippet: {
            publishedAt: string;
            channelId: string;
            title: string;
            description: string;
            thumbnails: {
                default: {
                    url: string;
                    width: number;
                    height: number;
                };
            };
            channelTitle: string;
            liveBroadcastContent: string;
        };
    }[];
};
