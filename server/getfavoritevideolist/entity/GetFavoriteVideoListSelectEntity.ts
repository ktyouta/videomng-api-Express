import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";
import { GetFavoriteVideoListPageModel } from "../model/GetFavoriteVideoListPageModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { GetFavoriteVideoListVideoCategoryModel } from "../model/GetFavoriteVideoListVideoCategoryModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";



export class GetFavoriteVideoListSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 視聴状況
    private readonly _viewStatusModel: GetFavoriteVideoListViewStatusModel;
    // カテゴリ
    private readonly _videoCategoryId: GetFavoriteVideoListVideoCategoryModel;
    // タグ名称
    private readonly _tagNameModel: GetFavoriteVideoListTagNameModel;
    // ソートキー
    private readonly _sortKeyModel: GetFavoriteVideoListSortIdModel;
    // お気に入り度
    private readonly _favoriteLevelModel: GetFavoriteVideoListFavoriteLevelModel;
    // ページ
    private readonly _pageModel: GetFavoriteVideoListPageModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        viewStatusModel: GetFavoriteVideoListViewStatusModel,
        videoCategoryId: GetFavoriteVideoListVideoCategoryModel,
        tagNameModel: GetFavoriteVideoListTagNameModel,
        sortKeyModel: GetFavoriteVideoListSortIdModel,
        favoriteLevelModel: GetFavoriteVideoListFavoriteLevelModel,
        pageModel: GetFavoriteVideoListPageModel) {

        this._frontUserIdModel = frontUserIdModel;
        this._viewStatusModel = viewStatusModel;
        this._videoCategoryId = videoCategoryId;
        this._tagNameModel = tagNameModel;
        this._sortKeyModel = sortKeyModel;
        this._favoriteLevelModel = favoriteLevelModel;
        this._pageModel = pageModel;
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
        return this._videoCategoryId.videoCategory;
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

    public get page() {
        return this._pageModel.page;
    }
}