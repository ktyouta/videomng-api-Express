import { Prisma } from "@prisma/client";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FavoriteVideoSortMasterRepositoryInterface } from "../interface/FavoriteVideoSortMasterRepositoryInterface";
import { ViewStatusModel } from "../../../common/properties/ViewStatusModel";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteVideoSortMasterRepositoryPostgres implements FavoriteVideoSortMasterRepositoryInterface {


    constructor() {

    }


    /**
     * ソートリストを取得
     */
    async getListByKey(sortId: string) {

        const seqData = await PrismaClientInstance.getInstance().favoriteVideoSortMaster.findUnique({
            where: { id: sortId },
        });

        return seqData;
    }
}