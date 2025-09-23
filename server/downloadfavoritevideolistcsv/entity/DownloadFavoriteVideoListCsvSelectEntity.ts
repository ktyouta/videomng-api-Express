import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";


export class DownloadFavoriteVideoListCsvSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel) {

        this._frontUserIdModel = frontUserIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }
}