import { Prisma } from "@prisma/client";
import { SeqKeyModel } from "../../internaldata/seqmaster/properties/SeqKeyModel";
import { SeqMasterRepositoryInterface } from "../../internaldata/seqmaster/repository/interface/SeqMasterRepositoryInterface";
import { SeqMasterRepositorys } from "../../internaldata/seqmaster/repository/SeqMasterRepositorys";
import { RepositoryType } from "../const/CommonConst";
import { PrismaClientInstance } from "./PrismaClientInstance";

export class SeqIssue {

    private static readonly INCREMENT_SEQ = 1;
    private static readonly _seqMasterRepository: SeqMasterRepositoryInterface =
        (new SeqMasterRepositorys().get(RepositoryType.POSTGRESQL));

    constructor() {
    }

    /**
     * シーケンスを発番する
     */
    static async get(keyModel: SeqKeyModel, tx: Prisma.TransactionClient) {

        // シーケンスを取得
        const sequence = await this._seqMasterRepository.getSequenceByKey(keyModel, tx);

        if (!sequence) {
            throw Error(`キーに対するシーケンスを取得できませんでした。key:${keyModel.key}`);
        }

        const retId = sequence.nextId;
        const nextId = retId + SeqIssue.INCREMENT_SEQ;

        // シーケンスを更新
        await this._seqMasterRepository.updateSequence(keyModel, nextId, tx);

        return retId;
    }
}