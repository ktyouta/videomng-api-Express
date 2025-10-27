import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG } from "../../util/const/CommonConst";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { UpdateFolderRequestType } from "../schema/UpdateFolderRequestSchema";
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