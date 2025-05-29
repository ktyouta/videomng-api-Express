import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";



export class GetFavoriteVideoListSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 視聴状況
    private readonly _viewStatusModel: GetFavoriteVideoListViewStatusModel;
    // カテゴリ
    private readonly _videoCategoryId: YouTubeDataApiVideoListVideoCategoryId;
    // タグ名称
    private readonly _tagNameModel: GetFavoriteVideoListTagNameModel;
    // ソートキー
    private readonly _sortKeyModel: GetFavoriteVideoListSortIdModel;
    // お気に入り度
    private readonly _favoriteLevelModel: GetFavoriteVideoListFavoriteLevelModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        viewStatusModel: GetFavoriteVideoListViewStatusModel,
        videoCategoryId: YouTubeDataApiVideoListVideoCategoryId,
        tagNameModel: GetFavoriteVideoListTagNameModel,
        sortKeyModel: GetFavoriteVideoListSortIdModel,
        favoriteLevelModel: GetFavoriteVideoListFavoriteLevelModel,) {

        this._frontUserIdModel = frontUserIdModel;
        this._viewStatusModel = viewStatusModel;
        this._videoCategoryId = videoCategoryId;
        this._tagNameModel = tagNameModel;
        this._sortKeyModel = sortKeyModel;
        this._favoriteLevelModel = favoriteLevelModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get viewStatus() {
        return this._viewStatusModel.viewStatus;
    }

    public get videoCategoryId() {
        return this._videoCategoryId.value;
    }

    public get tagNameModel() {
        return this._tagNameModel;
    }

    public get tagName() {
        return this._tagNameModel.tagName;
    }

    public get sortId() {
        return this._sortKeyModel.sortId;
    }

    public get favoriteLevel() {
        return this._favoriteLevelModel.favoriteLevel;
    }
}