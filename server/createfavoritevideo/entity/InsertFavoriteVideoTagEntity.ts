import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";

export class InsertFavoriteVideoTagEntity {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // タグID
    private readonly _tagIdModel: TagIdModel;


    constructor(frontUserIdModel: FrontUserIdModel, videoIdModel: VideoIdModel, tagIdModel: TagIdModel) {

        this._videoIdModel = videoIdModel;
        this._frontUserIdModel = frontUserIdModel;
        this._tagIdModel = tagIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

    public get tagId() {
        return this._tagIdModel.tagId;
    }
}