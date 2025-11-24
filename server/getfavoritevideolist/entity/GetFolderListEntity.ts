import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";
import { GetFavoriteVideoListPageModel } from "../model/GetFavoriteVideoListPageModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { GetFavoriteVideoListVideoCategoryModel } from "../model/GetFavoriteVideoListVideoCategoryModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";

export class GetFolderListEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;


    constructor(frontUserIdModel: FrontUserIdModel) {

        this._frontUserIdModel = frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }
}