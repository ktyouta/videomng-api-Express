import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG } from "../../util/const/CommonConst";
import { CreateFolderRequestType } from "../schema/CreateFolderRequestSchema";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";


export class InsertFolderEntity {

    // フォルダ名
    private readonly _folderNameModel: FolderNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;

    constructor(
        folderIdModel: FolderIdModel,
        folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
    ) {

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