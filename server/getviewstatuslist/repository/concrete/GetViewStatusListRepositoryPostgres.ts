import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { ViewStatusMaster } from "@prisma/client";
import { GetViewStatusListRepositoryInterface } from "../interface/GetViewStatusListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetViewStatusListRepositoryPostgres implements GetViewStatusListRepositoryInterface {

    constructor() {
    }

    /**
     * 視聴状況リスト取得
     * @returns 
     */
    async select(): Promise<ViewStatusMaster[]> {

        const viewStatus = await PrismaClientInstance.getInstance().$queryRaw<ViewStatusMaster[]>`
            SELECT
                id,
                label 
            FROM "view_status_master" 
            WHERE "delete_flg" = '0'
            `;

        return viewStatus;
    }

}