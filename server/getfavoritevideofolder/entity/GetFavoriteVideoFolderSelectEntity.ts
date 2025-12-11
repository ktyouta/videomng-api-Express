import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { GetFavoriteVideoFolderPageModel } from "../model/GetFavoriteVideoFolderPageModel";
import { GetFavoriteVideoFolderSortIdModel } from "../model/GetFavoriteVideoFolderSortIdModel";


export class GetFavoriteVideoFolderSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // ページ
    private readonly _pageModel: GetFavoriteVideoFolderPageModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;
    // ソートID
    private readonly _sortIdModel: GetFavoriteVideoFolderSortIdModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        pageModel: GetFavoriteVideoFolderPageModel,
        folderIdModel: FolderIdModel,
        sortIdModel: GetFavoriteVideoFolderSortIdModel,
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._pageModel = pageModel;
        this._folderIdModel = folderIdModel;
        this._sortIdModel = sortIdModel;
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
}