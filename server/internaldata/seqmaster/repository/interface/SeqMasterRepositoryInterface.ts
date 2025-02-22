import { Prisma, SeqMaster } from "@prisma/client";
import { SeqKeyModel } from "../../properties/SeqKeyModel";


/**
 * 永続ロジック用インターフェース
 */
export interface SeqMasterRepositoryInterface {

    /**
     * シーケンスを取得
     */
    getSequenceByKey(seqKeyModel: SeqKeyModel, tx: Prisma.TransactionClient): Promise<SeqMaster | null>;


    /**
     * シーケンスを更新
     * @param key 
     * @param nextId 
     */
    updateSequence(seqKeyModel: SeqKeyModel, nextId: number, tx: Prisma.TransactionClient): Promise<SeqMaster>;
}

