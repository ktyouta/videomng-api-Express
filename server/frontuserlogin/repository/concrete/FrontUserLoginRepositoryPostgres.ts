import { FrontUserLoginRepositoryInterface } from "../interface/FrontUserLoginRepositoryInterface";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserLoginMaster } from "@prisma/client";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserLoginRepositoryPostgres implements FrontUserLoginRepositoryInterface {

    constructor() {
    }


    /**
     * ユーザー取得
     * @returns 
     */
    public async select(frontUserLoginSelectEntity: FrontUserLoginSelectEntity) {

        const userId = frontUserLoginSelectEntity.frontUserId;
        const password = frontUserLoginSelectEntity.frontUserPassword;

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserLoginMaster[]>`
                    SELECT * 
                    FROM "front_user_info_master" 
                    WHERE user_id = ${userId} AND
                    password = ${password} AND
                     delete_flg = '0'
                    `;

        return frontUserList;
    }

}