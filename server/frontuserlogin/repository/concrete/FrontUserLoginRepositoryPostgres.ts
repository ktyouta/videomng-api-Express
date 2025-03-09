import { FrontUserLoginRepositoryInterface } from "../interface/FrontUserLoginRepositoryInterface";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserInfoMaster, FrontUserLoginMaster } from "@prisma/client";
import { FrontUserInfoSelectEntity } from "../../entity/FrontUserInfoSelectEntity";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserLoginRepositoryPostgres implements FrontUserLoginRepositoryInterface {

    constructor() {
    }


    /**
     * ログイン情報を取得
     * @returns 
     */
    public async selectLoginUser(frontUserLoginSelectEntity: FrontUserLoginSelectEntity) {

        const userId = frontUserLoginSelectEntity.frontUserId;

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserLoginMaster[]>`
                    SELECT * 
                    FROM "front_user_login_master" 
                    WHERE "user_id" = CAST(${userId} AS INTEGER) AND
                    "delete_flg" = '0'
                    `;

        return frontUserList;
    }


    /**
     * ユーザー情報を取得
     * @returns 
     */
    public async selectUserInfo(frontUserInfoSelectEntity: FrontUserInfoSelectEntity) {

        const userId = frontUserInfoSelectEntity.frontUserId;

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserInfoMaster[]>`
                    SELECT * 
                    FROM "front_user_info_master" 
                    WHERE "user_id" = CAST(${userId} AS INTEGER) AND
                    "delete_flg" = '0'
                    `;

        return frontUserList;
    }
}