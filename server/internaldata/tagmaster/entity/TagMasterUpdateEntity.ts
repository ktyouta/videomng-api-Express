import { VideoIdModel } from "../../common/properties/VideoIdModel";
import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { TagIdModel } from "../properties/TagIdModel";
import { TagNameModel } from "../properties/TagNameModel";


export class TagMasterUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // タグID
    private readonly _tagIdModel: TagIdModel;
    // タグ名
    private readonly _tagNameModel: TagNameModel;

    constructor(userId: FrontUserIdModel,
        tagIdModel: TagIdModel,
        tagNameModel: TagNameModel) {

        this._frontUserIdModel = userId;
        this._tagIdModel = tagIdModel;
        this._tagNameModel = tagNameModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get tagIdModel() {
        return this._tagIdModel;
    }

    public get tagNameModel() {
        return this._tagNameModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get tagId() {
        return this._tagIdModel.tagId;
    }

    public get tagName() {
        return this._tagNameModel.tagName;
    }
}