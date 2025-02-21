import { JsonFileData } from "../../../util/service/JsonFileData";
import { SeqIssue } from "../../../util/service/SeqIssue";
import { SeqKeyModel } from "../../seqmaster/properties/SeqKeyModel";


export class FrontUserIdModel {

    private _frontUserId: number;

    private constructor(userId: number) {

        if (!userId) {
            throw Error(`ユーザーIDが設定されていません。`);
        }

        this._frontUserId = userId;
    }


    /**
     * ユーザーIDを発番する
     * @returns 
     */
    public static async create() {

        const keyModel = new SeqKeyModel(``);
        const newId = await SeqIssue.get(keyModel);

        return new FrontUserIdModel(newId);
    }

    public get frontUserId() {
        return this._frontUserId;
    }

    /**
     * userIdをセット
     * @param userId 
     * @returns 
     */
    public static reConstruct(userId: number) {
        return new FrontUserIdModel(userId);
    }
}