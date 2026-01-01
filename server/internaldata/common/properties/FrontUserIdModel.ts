import { Prisma } from "@prisma/client";
import { AccessTokenModel } from "../../../accesstoken/model/AccessTokenModel";
import { SeqIssue } from "../../../util/SeqIssue";
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
     * ユーザーIDをセット
     * @param userId 
     * @returns 
     */
    static reConstruct(userId: number) {
        return new FrontUserIdModel(userId);
    }

    /**
     * アクセストークンからユーザーIDを取得
     * @param accessTokenModel 
     * @returns 
     */
    static fromHAccessToken(accessTokenModel: AccessTokenModel) {

        // トークン検証
        const decode = accessTokenModel.verify();
        const userIdModel = FrontUserIdModel.reConstruct(decode.sub);

        return userIdModel;
    }
}