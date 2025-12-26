import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";



export class RefreshSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel) {

        this._frontUserIdModel = frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }
}