import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";


export class SelectExistsFolderEntity {

    // フォルダID
    private readonly _folderIdModel: FolderIdModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(folderIdModel: FolderIdModel, frontUserIdModel: FrontUserIdModel) {

        this._folderIdModel = folderIdModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderId() {
        return this._folderIdModel.id;
    }
}