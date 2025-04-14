import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { UpdateFavoriteVideoTagRequestType } from "../type/UpdateFavoriteVideoTagRequestType";
import { SummaryModel } from "../../internaldata/favoritevideotransaction/properties/SummaryModel";
import { ViewStatusModel } from "../../internaldata/common/properties/ViewStatusModel";
import { CategoryIdModel } from "../../internaldata/favoritevideocateorytransaction/properties/CategoryIdModel";
import { UpdateFavoriteVideoTagType } from "../type/UpdateFavoriteVideoTagType";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";

export class UpdateFavoriteVideoTagRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // タグ
    private readonly _tagList: UpdateFavoriteVideoTagType[];
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;


    constructor(videoIdModel: VideoIdModel,
        requestBody: UpdateFavoriteVideoTagRequestType,
        frontUserIdModel: FrontUserIdModel) {

        this._videoIdModel = videoIdModel;
        this._tagList = requestBody.tag;
        this._frontUserIdModel = frontUserIdModel;
    }


    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get tagList() {
        return this._tagList;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }
}