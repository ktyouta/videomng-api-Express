import { FrontUserLoginMaster, Prisma } from "@prisma/client";
import { FrontUserLoginMasterUpdateEntity } from "../../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateEntity";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { UpdateFrontUserPasswordSelectEntity } from "../../entity/UpdateFrontUserPasswordSelectEntity";
import { UpdateFrontUserPasswordRepositoryInterface } from "../interface/UpdateFrontUserPasswordRepositoryPostgres";



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

    /**
     * フロントのユーザー情報を更新
     */
    async update(entity: FrontUserLoginMasterUpdateEntity,
        tx: Prisma.TransactionClient) {

        const userId = entity.frontUserId;
        const password = entity.frontUserPassword;
        const salt = entity.salt;

        const userInfo = tx.frontUserLoginMaster.update({
            where: { userId },
            data: {
                password,
                salt,
                updateDate: new Date(),
            },
        });

        return userInfo;
    }
}