import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";


export class SelectFolderListEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel) {

        this._frontUserIdModel = frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }
}