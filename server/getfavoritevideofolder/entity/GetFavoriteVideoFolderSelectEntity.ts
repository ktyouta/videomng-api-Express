import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { GetFavoriteVideoFolderFavoriteLevelModel } from "../model/GetFavoriteVideoFolderFavoriteLevelModel";
import { GetFavoriteVideoFolderPageModel } from "../model/GetFavoriteVideoFolderPageModel";
import { GetFavoriteVideoFolderSortIdModel } from "../model/GetFavoriteVideoFolderSortIdModel";
import { GetFavoriteVideoFolderTagNameModel } from "../model/GetFavoriteVideoFolderTagNameModel";
import { GetFavoriteVideoFolderVideoCategoryModel } from "../model/GetFavoriteVideoFolderVideoCategoryModel";
import { GetFavoriteVideoFolderViewStatusModel } from "../model/GetFavoriteVideoFolderViewStatusModel";


export class GetFavoriteVideoFolderSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // ページ
    private readonly _pageModel: GetFavoriteVideoFolderPageModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;
    // ソートID
    private readonly _sortIdModel: GetFavoriteVideoFolderSortIdModel;
    // 視聴状況
    private readonly _viewStatusModel: GetFavoriteVideoFolderViewStatusModel;
    // カテゴリ
    private readonly _videoCategoryId: GetFavoriteVideoFolderVideoCategoryModel;
    // タグ名称
    private readonly _tagNameModel: GetFavoriteVideoFolderTagNameModel;
    // お気に入り度
    private readonly _favoriteLevelModel: GetFavoriteVideoFolderFavoriteLevelModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        pageModel: GetFavoriteVideoFolderPageModel,
        folderIdModel: FolderIdModel,
        sortIdModel: GetFavoriteVideoFolderSortIdModel,
        viewStatusModel: GetFavoriteVideoFolderViewStatusModel,
        videoCategoryId: GetFavoriteVideoFolderVideoCategoryModel,
        tagNameModel: GetFavoriteVideoFolderTagNameModel,
        favoriteLevelModel: GetFavoriteVideoFolderFavoriteLevelModel,
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._pageModel = pageModel;
        this._folderIdModel = folderIdModel;
        this._sortIdModel = sortIdModel;
        this._viewStatusModel = viewStatusModel;
        this._videoCategoryId = videoCategoryId;
        this._tagNameModel = tagNameModel;
        this._favoriteLevelModel = favoriteLevelModel;

    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get page() {
        return this._pageModel.page;
    }

    get folderId() {
        return this._folderIdModel.id;
    }

    get sortId() {
        return this._sortIdModel.sortId;
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

    public get favoriteLevel() {
        return this._favoriteLevelModel.favoriteLevel;
    }
}