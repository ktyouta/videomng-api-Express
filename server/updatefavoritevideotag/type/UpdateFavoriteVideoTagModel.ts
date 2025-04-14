import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";

export class UpdateFavoriteVideoTagModel {

    // タグID
    private readonly _tagIdModel: TagIdModel;
    // タグ名称
    private readonly _tagNameModel: TagNameModel;

    constructor(tagIdModel: TagIdModel,
        tagNameModel: TagNameModel) {

        this._tagIdModel = tagIdModel;
        this._tagNameModel = tagNameModel;
    }

    get tagIdModel() {
        return this._tagIdModel;
    }

    get tagNameModel() {
        return this._tagNameModel;
    }
}