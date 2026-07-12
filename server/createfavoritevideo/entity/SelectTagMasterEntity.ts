import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";


export class SelectTagMasterEntity {

    // タグIDリスト
    private readonly _tagIdModelList: TagIdModel[];
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(tagIdModelList: TagIdModel[], frontUserIdModel: FrontUserIdModel) {
        this._tagIdModelList = tagIdModelList;
        this._frontUserIdModel = frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get tagIdList(): number[] {
        return this._tagIdModelList.map((e) => e.tagId);
    }
}
