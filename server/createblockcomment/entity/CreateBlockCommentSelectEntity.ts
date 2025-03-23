import { CommentIdModel } from "../../internaldata/blockcommenttransaction/properties/CommentIdModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG } from "../../util/const/CommonConst";



export class CreateBlockCommentSelectEntity {

    // コメントID
    private readonly _commentIdModel: CommentIdModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel, commentIdModel: CommentIdModel) {

        this._commentIdModel = commentIdModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    public get commentIdModel() {
        return this._commentIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get commentId() {
        return this._commentIdModel.commentId;
    }

}