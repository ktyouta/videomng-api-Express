import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderColorModel } from "../../internaldata/foldermaster/model/FolderColorModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";


export class InsertFolderEntity {

    // フォルダ名
    private readonly _folderNameModel: FolderNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;
    // フォルダカラー
    private readonly _folderColorModel: FolderColorModel;

    constructor(
        folderIdModel: FolderIdModel,
        folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
        folderColorModel: FolderColorModel,
    ) {

        this._folderNameModel = folderNameModel;
        this._frontUserIdModel = frontUserIdModel;
        this._folderIdModel = folderIdModel;
        this._folderColorModel = folderColorModel;
        ;
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

    get folderColor() {
        return this._folderColorModel.value;
    }
}