import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { UpdateFavoriteVideoCustomRequestType } from "./UpdateFavoriteVideoCustomRequestType";
import { SummaryModel } from "../../internaldata/favoritevideotransaction/properties/SummaryModel";
import { ViewStatusModel } from "../../internaldata/common/properties/ViewStatusModel";
import { CategoryIdModel } from "../../internaldata/favoritevideocateorytransaction/properties/CategoryIdModel";
import { FavoriteLevelModel } from "../../internaldata/favoritevideotransaction/properties/FavoriteLevelModel";
import { IsVisibleAfterFolderAddModel } from "../../internaldata/favoritevideotransaction/properties/IsVisibleAfterFolderAddModel";

export class UpdateFavoriteVideoCustomRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // 要約
    private readonly _summaryModel: SummaryModel;
    // 視聴状況
    private readonly _viewStatusModel: ViewStatusModel;
    // カテゴリ
    private readonly _categoryIdModelList: CategoryIdModel[];
    // お気に入り度
    private readonly _favoriteLevelModel: FavoriteLevelModel;
    // フォルダ内動画一覧画面表示フラグ
    private readonly _isVisibleAfterFolderAddModel: IsVisibleAfterFolderAddModel;


    constructor(videoIdModel: VideoIdModel,
        summaryModel: SummaryModel,
        viewStatusModel: ViewStatusModel,
        categoryIdModelList: CategoryIdModel[],
        favoriteLevelModel: FavoriteLevelModel,
        isVisibleAfterFolderAddModel: IsVisibleAfterFolderAddModel) {

        this._videoIdModel = videoIdModel;
        this._summaryModel = summaryModel;
        this._viewStatusModel = viewStatusModel;
        this._categoryIdModelList = categoryIdModelList;
        this._favoriteLevelModel = favoriteLevelModel;
        this._isVisibleAfterFolderAddModel = isVisibleAfterFolderAddModel;
    }

    static async set(videoIdModel: VideoIdModel,
        updateFavoriteVideoRequest: UpdateFavoriteVideoCustomRequestType) {

        const _categoryIdModelList = updateFavoriteVideoRequest.category?.map((e: string) => {
            return new CategoryIdModel(e);
        });

        return new UpdateFavoriteVideoCustomRequestModel(
            videoIdModel,
            new SummaryModel(updateFavoriteVideoRequest.summary),
            await ViewStatusModel.reConstruct(updateFavoriteVideoRequest.viewStatus),
            _categoryIdModelList,
            new FavoriteLevelModel(updateFavoriteVideoRequest.favoriteLevel),
            new IsVisibleAfterFolderAddModel(updateFavoriteVideoRequest.isVisibleAfterFolderAdd),
        );
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get summaryModel() {
        return this._summaryModel;
    }

    public get viewStatusModel() {
        return this._viewStatusModel;
    }

    public get categoryIdModelList() {
        return this._categoryIdModelList;
    }

    public get favoriteLevelModel() {
        return this._favoriteLevelModel;
    }

    public get isVisibleAfterFolderAddModel() {
        return this._isVisibleAfterFolderAddModel;
    }
}