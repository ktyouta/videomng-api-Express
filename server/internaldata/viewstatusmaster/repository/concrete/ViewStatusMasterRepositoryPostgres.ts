import { Prisma } from "@prisma/client";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { ViewStatusMasterRepositoryInterface } from "../interface/ViewStatusMasterRepositoryInterface";
import { ViewStatusModel } from "../../../common/properties/ViewStatusModel";



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