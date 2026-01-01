import { FrontUserInfoMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { FrontUserInfoUpdateSelectEntity } from "../../entity/FrontUserInfoUpdateSelectEntity";
import { FrontUserInfoUpdateRepositoryInterface } from "../interface/FrontUserInfoUpdateRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserInfoUpdateRepositoryPostgres implements FrontUserInfoUpdateRepositoryInterface {

    constructor() {
    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(frontUserInfoUpdateSelectEntity: FrontUserInfoUpdateSelectEntity): Promise<FrontUserInfoMaster[]> {

        const userName = frontUserInfoUpdateSelectEntity.frontUserName;
        const userId = frontUserInfoUpdateSelectEntity.frontUserId;

        const users = await PrismaClientInstance.getInstance().$queryRaw<FrontUserInfoMaster[]>`
            SELECT 
                * 
            FROM 
                "front_user_info_master"
            WHERE 
                user_name = ${userName} AND
                user_id <> CAST(${userId} AS INTEGER) AND
                delete_flg = '0'
        `;

        return users;
    }

}