import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";


export class DeleteFavoriteVideoEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;

    constructor(
        folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._folderIdModel = folderIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderId() {
        return this._folderIdModel.id;
    }
}