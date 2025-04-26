import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../common/properties/VideoIdModel";
import { ViewStatusModel } from "../../common/properties/ViewStatusModel";


export class FavoriteVideoTransactionInsertEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // 視聴状況
    private readonly _viewStatusModel: ViewStatusModel;
    // 視聴状況デフォルト値
    private static VIEW_STATUS_DEFOULT = `0`;

    private constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        viewStatusModel: ViewStatusModel,) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
        this._viewStatusModel = viewStatusModel;
    }

    static async create(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,) {

        const viewStatusModel = await ViewStatusModel.reConstruct(FavoriteVideoTransactionInsertEntity.VIEW_STATUS_DEFOULT);

        return new FavoriteVideoTransactionInsertEntity(
            userId,
            videoIdModel,
            viewStatusModel
        );
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get viewStatusModel() {
        return this._viewStatusModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

    public get viewStatus() {
        return this._viewStatusModel.viewStatus;
    }
}