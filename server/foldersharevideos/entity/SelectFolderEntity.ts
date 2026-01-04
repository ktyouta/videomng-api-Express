import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";


export class SelectFolderEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;

    constructor(frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        videoIdModel: VideoIdModel,
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._folderIdModel = folderIdModel;
        this._videoIdModel = videoIdModel
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get folderId() {
        return this._folderIdModel.id;
    }

    get videoId() {
        return this._videoIdModel.videoId;
    }
}