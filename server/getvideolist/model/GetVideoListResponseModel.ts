import { YouTubeDataApiVideoListModel } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel";
import { YouTubeDataApiVideoListItemType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType";
import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListResponseType";

export class GetVideoListResponseModel {

    private readonly _data: YouTubeDataApiVideoListResponseType;

    constructor(youTubeDataApiVideoListModel: YouTubeDataApiVideoListModel) {

        const response = youTubeDataApiVideoListModel.response;

        // 動画IDの存在しないデータをフィルターする
        const filterdResponse = {
            kind: response.kind,
            etag: response.etag,
            pageInfo: response.pageInfo,
            nextPageToken: response.nextPageToken,
            items: response.items.filter((e: YouTubeDataApiVideoListItemType) => {
                return !!e.id.videoId;
            })
        }

        this._data = filterdResponse;
    }

    get data() {
        return this._data;
    }
}