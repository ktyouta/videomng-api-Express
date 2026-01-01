import { PrismaClientInstance } from "../../../../util/PrismaClientInstance";
import { ViewStatusMasterRepositoryInterface } from "../interface/ViewStatusMasterRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class ViewStatusMasterRepositoryPostgres implements ViewStatusMasterRepositoryInterface {


    constructor() {

    }


    /**
     * 視聴状況を取得
     */
    async getSequenceByKey(viewStatus: string) {

        const seqData = await PrismaClientInstance.getInstance().viewStatusMaster.findUnique({
            where: { id: viewStatus },
        });

        return seqData;
    }
}