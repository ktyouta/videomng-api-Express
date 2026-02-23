import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";


export class SelectDuplicationFolderEntity {

    // フォルダ名
    private readonly _folderNameModel: FolderNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;

    constructor(folderNameModel: FolderNameModel, frontUserIdModel: FrontUserIdModel, folderIdModel: FolderIdModel) {

        this._folderNameModel = folderNameModel;
        this._frontUserIdModel = frontUserIdModel;
        this._folderIdModel = folderIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderName() {
        return this._folderNameModel.name;
    }

    get folderId() {
        return this._folderIdModel.id;
    }
}