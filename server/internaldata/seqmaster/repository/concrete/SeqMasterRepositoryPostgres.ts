import { Prisma } from "@prisma/client";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { SeqKeyModel } from "../../properties/SeqKeyModel";
import { SeqMasterRepositoryInterface } from "../interface/SeqMasterRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class SeqMasterRepositoryPostgres implements SeqMasterRepositoryInterface {


    constructor() {

    }


    /**
     * シーケンスを取得
     */
    async getSequenceByKey(seqKeyModel: SeqKeyModel, tx: Prisma.TransactionClient) {

        const key = seqKeyModel.key;

        const seqData = tx.seqMaster.findUnique({
            where: { key },
        });

        return seqData;
    }


    /**
     * シーケンスを更新
     */
    async updateSequence(seqKeyModel: SeqKeyModel, nextId: number, tx: Prisma.TransactionClient) {

        const key = seqKeyModel.key;

        const seqData = tx.seqMaster.update({
            where: { key },
            data: {
                nextId,
                updateDate: new Date(),
            },
        });

        return seqData;
    }
}