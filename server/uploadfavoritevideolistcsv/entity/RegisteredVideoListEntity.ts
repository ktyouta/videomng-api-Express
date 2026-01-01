import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RegisterVideoIdListModel } from "../model/RegisterVideoIdListModel";



export class RegisteredVideoListEntity {

    // 動画IDリスト
    private readonly _registerVideoIdListModel: RegisterVideoIdListModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel, registerVideoIdListModel: RegisterVideoIdListModel) {

        this._registerVideoIdListModel = registerVideoIdListModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    public get registerVideoIdListModel() {
        return this._registerVideoIdListModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get registerVideoIdList() {
        return this._registerVideoIdListModel.videoIdList;
    }

}