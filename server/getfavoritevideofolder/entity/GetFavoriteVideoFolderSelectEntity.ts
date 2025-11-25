import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { GetFavoriteVideoFolderPageModel } from "../model/GetFavoriteVideoListPageModel";


export class GetFavoriteVideoFolderSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // ページ
    private readonly _pageModel: GetFavoriteVideoFolderPageModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        pageModel: GetFavoriteVideoFolderPageModel,
        folderIdModel: FolderIdModel
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._pageModel = pageModel;
        this._folderIdModel = folderIdModel;
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
}