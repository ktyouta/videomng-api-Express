import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";


export class DeleteFavoriteVideoFolderEntity {

    // フォルダ名
    private readonly _videoIdModel: VideoIdModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フォルダID
    private readonly _folderIdModel: FolderIdModel;

    constructor(
        folderIdModel: FolderIdModel,
        videoIdModel: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
    ) {

        this._videoIdModel = videoIdModel;
        this._frontUserIdModel = frontUserIdModel;
        this._folderIdModel = folderIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get videoId() {
        return this._videoIdModel.videoId;
    }

    get folderId() {
        return this._folderIdModel.id;
    }
}