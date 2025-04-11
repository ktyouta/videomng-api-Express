import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";



export class GetFavoriteVideoListSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 視聴状況
    private readonly _viewStatusModel: GetFavoriteVideoListViewStatusModel;
    // カテゴリ
    private readonly _videoCategoryId: YouTubeDataApiVideoListVideoCategoryId;

    constructor(frontUserIdModel: FrontUserIdModel,
        viewStatusModel: GetFavoriteVideoListViewStatusModel,
        videoCategoryId: YouTubeDataApiVideoListVideoCategoryId) {

        this._frontUserIdModel = frontUserIdModel;
        this._viewStatusModel = viewStatusModel;
        this._videoCategoryId = videoCategoryId;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get viewStatus() {
        return this._viewStatusModel.viewStatus;
    }

    public get videoCategoryId() {
        return this._videoCategoryId.value;
    }
}