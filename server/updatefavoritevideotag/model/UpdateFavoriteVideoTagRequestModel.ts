import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FavoriteVideoTagInputType } from "../type/FavoriteVideoTagInputType";
import { UpdateFavoriteVideoTagRequestType } from "../type/UpdateFavoriteVideoTagRequestType";

export class UpdateFavoriteVideoTagRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // タグ
    private readonly _tagList: FavoriteVideoTagInputType[];
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;


    constructor(videoIdModel: VideoIdModel,
        requestBody: UpdateFavoriteVideoTagRequestType,
        frontUserIdModel: FrontUserIdModel) {

        this._videoIdModel = videoIdModel;
        this._tagList = requestBody.tag;
        this._frontUserIdModel = frontUserIdModel;
    }


    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get tagList() {
        return this._tagList;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }
}