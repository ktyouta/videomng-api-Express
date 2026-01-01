import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";


export class SelectFolderEntity {

    // フォルダ名
    private readonly _folderNameModel: FolderNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(folderNameModel: FolderNameModel, frontUserIdModel: FrontUserIdModel) {

        this._folderNameModel = folderNameModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderName() {
        return this._folderNameModel.name;
    }
}