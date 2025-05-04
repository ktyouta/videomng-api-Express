import { UpdateFrontUserPasswordSelectEntity } from "../../entity/UpdateFrontUserPasswordSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { UpdateFrontUserPasswordRepositoryInterface } from "../interface/UpdateFrontUserPasswordRepositoryPostgres";
import { FrontUserInfoMaster, FrontUserLoginMaster } from "@prisma/client";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFrontUserPasswordRepositoryPostgres implements UpdateFrontUserPasswordRepositoryInterface {

    constructor() {
    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(updateFrontUserPasswordSelectEntity: UpdateFrontUserPasswordSelectEntity): Promise<FrontUserLoginMaster[]> {

        const userId = updateFrontUserPasswordSelectEntity.frontUserId;

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserLoginMaster[]>`
            SELECT 
                *
            FROM "front_user_login_master" 
            WHERE "user_id" = CAST(${userId} AS INTEGER) AND
            "delete_flg" = '0'
            `;

        return frontUserList;
    }

}