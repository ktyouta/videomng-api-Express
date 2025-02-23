import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserInfoCreateSelectEntity } from "../../entity/FrontUserInfoCreateSelectEntity";
import { FrontUserInfoCreateRepositoryInterface } from "../interface/FrontUserInfoCreateRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserInfoCreateRepositoryPostgres implements FrontUserInfoCreateRepositoryInterface {

    constructor() {
    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(frontUserInfoCreateSelectEntity: FrontUserInfoCreateSelectEntity): Promise<FrontUserInfoMaster> {

        const userName = frontUserInfoCreateSelectEntity.frontUserName;

        const users = await PrismaClientInstance.getInstance().$queryRaw<FrontUserInfoMaster>`
            SELECT * FROM "front_user_info_master" WHERE user_name = ${userName} AND delete_flg = '0'
            `;

        return users;
    }

}