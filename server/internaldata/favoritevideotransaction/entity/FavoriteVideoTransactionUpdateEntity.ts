import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../common/properties/VideoIdModel";
import { SummaryModel } from "../properties/SummaryModel";
import { ViewStatusModel } from "../../common/properties/ViewStatusModel";
import { FavoriteLevelModel } from "../properties/FavoriteLevelModel";
import { IsVisibleAfterFolderAddModel } from "../properties/IsVisibleAfterFolderAddModel";


export class FavoriteVideoTransactionUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // 要約
    private readonly _summaryModel: SummaryModel;
    // 視聴状況
    private readonly _viewStatusModel: ViewStatusModel;
    // お気に入り度
    private readonly _favoriteLevelModel: FavoriteLevelModel;
    // フォルダ内動画一覧画面表示フラグ
    private readonly _isVisibleAfterFolderAddModel: IsVisibleAfterFolderAddModel;


    constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        summaryModel: SummaryModel,
        viewStatusModel: ViewStatusModel,
        favoriteLevelModel: FavoriteLevelModel,
        isVisibleAfterFolderAddModel: IsVisibleAfterFolderAddModel,) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
        this._summaryModel = summaryModel;
        this._viewStatusModel = viewStatusModel;
        this._favoriteLevelModel = favoriteLevelModel;
        this._isVisibleAfterFolderAddModel = isVisibleAfterFolderAddModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

    public get summary() {
        return this._summaryModel.summary;
    }

    public get viewStatus() {
        return this._viewStatusModel.viewStatus;
    }

    public get favoriteLevel() {
        return this._favoriteLevelModel.favoriteLevel;
    }

    public get isVisibleAfterFolderAdd() {
        return this._isVisibleAfterFolderAddModel.value;
    }
}