import { YouTubeDataApiVideoCategoryModel } from "../../external/youtubedataapi/videocategory/model/YouTubeDataApiVideoCategoryModel";
import { YouTubeDataApiVideoCategoryItemType } from "../../external/youtubedataapi/videocategory/type/YouTubeDataApiVideoCategoryItemType";
import { YouTubeDataApiVideoCategoryResponseType } from "../../external/youtubedataapi/videocategory/type/YouTubeDataApiVideoCategoryResponseType";

export class GetVideoCategoryResponseModel {

    private readonly _data: YouTubeDataApiVideoCategoryResponseType;

    constructor(youTubeVideoCategoryApi: YouTubeDataApiVideoCategoryModel) {

        const response = youTubeVideoCategoryApi.response;

        // 動画のカテゴリとして割り当て可能なリストを取得する
        const filterdResponse: YouTubeDataApiVideoCategoryResponseType = {
            kind: response.kind,
            etag: response.etag,
            items: response.items.filter((e: YouTubeDataApiVideoCategoryItemType) => {
                return e.snippet.assignable;
            }),
        }

        this._data = filterdResponse;
    }

    get data() {
        return this._data;
    }
}