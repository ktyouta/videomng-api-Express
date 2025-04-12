import { VideoIdModel } from "../../common/properties/VideoIdModel";
import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { TagIdModel } from "../../common/properties/TagIdModel";


export class FavoriteVideoTagTransactionSoftDeleteEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // カテゴリ
    private readonly _tagIdModel: TagIdModel;

    constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tagIdModel: TagIdModel,) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
        this._tagIdModel = tagIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get tagIdModel() {
        return this._tagIdModel;
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