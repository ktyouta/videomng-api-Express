import { VideoCommentModel } from "../../internaldata/favoritevideocommenttransaction/properties/VideoCommentModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { UpdateFavoriteVideoRequestType } from "./UpdateFavoriteVideoRequestType";

export class UpdateFavoriteVideoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // コメント
    private readonly _videoCommentModel: VideoCommentModel[];

    constructor(videoIdModel: VideoIdModel,
        updateFavoriteVideoRequestType: UpdateFavoriteVideoRequestType) {

        const comments = updateFavoriteVideoRequestType.comments.map((e: string) => {
            return new VideoCommentModel(e);
        });

        this._videoIdModel = videoIdModel;
        this._videoCommentModel = comments;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoCommentModel() {
        return this._videoCommentModel;
    }
}