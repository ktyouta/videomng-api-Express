import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { ParentFolderIdModel } from "../../internaldata/foldermaster/model/ParentFolderIdModel";


export class SelectFolderEntity {

    // フォルダ名
    private readonly _folderNameModel: FolderNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 親フォルダID
    private readonly _parentFolderId: ParentFolderIdModel;

    constructor(folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
        parentFolderId: ParentFolderIdModel) {

        this._folderNameModel = folderNameModel;
        this._frontUserIdModel = frontUserIdModel;
        this._parentFolderId = parentFolderId;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderName() {
        return this._folderNameModel.name;
    }

    get parentFolderId() {
        return this._parentFolderId.id;
    }
}