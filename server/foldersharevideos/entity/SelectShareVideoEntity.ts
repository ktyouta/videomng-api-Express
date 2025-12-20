import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";


export class SelectShareVideoEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
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