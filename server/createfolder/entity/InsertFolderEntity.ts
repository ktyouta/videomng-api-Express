import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderColorModel } from "../../internaldata/foldermaster/model/FolderColorModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { ParentFolderIdModel } from "../../internaldata/foldermaster/model/ParentFolderIdModel";


export class InsertFolderEntity {

    // フォルダ名
    private readonly _folderNameModel: FolderNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダカラー
    private readonly _folderColorModel: FolderColorModel;
    // 親フォルダID
    private readonly _parentFolderId: ParentFolderIdModel;

    constructor(
        folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
        folderColorModel: FolderColorModel,
        parentFolderId: ParentFolderIdModel,
    ) {

        this._folderNameModel = folderNameModel;
        this._frontUserIdModel = frontUserIdModel;
        this._folderColorModel = folderColorModel;
        this._parentFolderId = parentFolderId;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderName() {
        return this._folderNameModel.name;
    }

    get folderColor() {
        return this._folderColorModel.value;
    }

    get parentFolderId() {
        return this._parentFolderId.id;
    }
}