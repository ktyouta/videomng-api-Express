import { Prisma } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { SeqIssue } from "../../../util/service/SeqIssue";
import { SeqKeyModel } from "../../seqmaster/properties/SeqKeyModel";


export class FrontUserIdModel {

    private _frontUserId: number;
    private static readonly SEQ_KEY = `front_user_id`;

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
    static async create(tx: Prisma.TransactionClient) {

        const keyModel = new SeqKeyModel(this.SEQ_KEY);
        const newId = await SeqIssue.get(keyModel, tx);

        return new FrontUserIdModel(newId);
    }

    get frontUserId() {
        return this._frontUserId;
    }

    /**
     * userIdをセット
     * @param userId 
     * @returns 
     */
    static reConstruct(userId: number) {
        return new FrontUserIdModel(userId);
    }
}