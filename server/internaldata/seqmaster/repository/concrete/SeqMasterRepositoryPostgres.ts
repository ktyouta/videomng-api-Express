import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { SeqMasterRepositoryPostgresRepositoryInterface } from "../interface/SeqMasterRepositoryPostgresRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class SeqMasterRepositoryPostgres implements SeqMasterRepositoryPostgresRepositoryInterface {


    constructor() {

    }


    /**
     * シーケンスを取得
     */
    async getSequenceByKey(key: string) {

        const seqData = PrismaClientInstance.getInstance().seqMaster.findUnique({
            where: { key },
        });

        return seqData;
    }

}