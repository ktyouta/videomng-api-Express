import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { CreateFavoriteVideoRequestType } from "./CreateFavoriteVideoRequestType";

export class CreateFavoriteVideoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // タグリスト
    private readonly _tagList: TagIdModel[];
    // フォルダID
    private readonly _folderIdModel?: FolderIdModel;

    constructor(body: CreateFavoriteVideoRequestType) {
        this._videoIdModel = new VideoIdModel(body.videoId);
        this._tagList = body.tagList ? body.tagList.map((e) => new TagIdModel(e)) : [];
        if (body.folderId) {
            this._folderIdModel = new FolderIdModel(body.folderId);
        }
    }

    get videoIdModel() {
        return this._videoIdModel;
    }

    get tagList() {
        return this._tagList;
    }

    get folderIdModel() {
        return this._folderIdModel;
    }
}