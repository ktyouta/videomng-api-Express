import { VideoIdModel } from "../../common/properties/VideoIdModel";
import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { CategoryIdModel } from "../properties/CategoryIdModel";


export class FavoriteVideoCategoryTransactionInsertEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // カテゴリ
    private readonly _videoCateogryModel: CategoryIdModel;

    constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        videoCateogryModel: CategoryIdModel,) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
        this._videoCateogryModel = videoCateogryModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoCateogryModel() {
        return this._videoCateogryModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

    public get categoryId() {
        return this._videoCateogryModel.categoryId;
    }
}