import { FrontUserInfoMaster, FrontUserLoginMaster, Prisma } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserInfoSelectEntity } from "../../entity/FrontUserInfoSelectEntity";
import { FrontUserInfoUpdateLastLoginDateEntity } from "../../entity/FrontUserInfoUpdateLastLoginDateEntity";
import { FrontUserInfoUpdatePasswordEntity } from "../../entity/FrontUserInfoUpdatePasswordEntity";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";
import { FrontUserLoginRepositoryInterface } from "../interface/FrontUserLoginRepositoryInterface";



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

        const frontUserName = frontUserLoginSelectEntity.frontUserName;

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserLoginMaster[]>`
                    SELECT 
                        user_id as "userId",
                        salt,
                        password
                    FROM "front_user_login_master" 
                    WHERE "user_name" = ${frontUserName} AND
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
                    SELECT 
                        user_id as "userId",
                        user_name as "userName",
                        user_birthday as "userBirthday"
                    FROM "front_user_info_master" 
                    WHERE "user_id" = CAST(${userId} AS INTEGER) AND
                    "delete_flg" = '0'
                    `;

        return frontUserList;
    }


    /**
     * ユーザーの最終ログイン日時を更新
     * @param frontUserInfoUpdateLastLoginDateEntity 
     * @param tx 
     * @returns 
     */
    async updateLastLoginDate(frontUserInfoUpdateLastLoginDateEntity: FrontUserInfoUpdateLastLoginDateEntity,
        tx: Prisma.TransactionClient) {

        const userId = frontUserInfoUpdateLastLoginDateEntity.frontUserId;

        const userInfo = tx.frontUserInfoMaster.update({
            where: { userId },
            data: {
                updateDate: new Date(),
                lastLoginDate: new Date(),
            },
        });

        return userInfo;
    }


    /**
     * パスワードを更新
     * @param frontUserInfoUpdateLastLoginDateEntity 
     * @param tx 
     * @returns 
     */
    async updatePassword(entity: FrontUserInfoUpdatePasswordEntity, tx: Prisma.TransactionClient) {

        const userId = entity.frontUserId;
        const password = entity.password;

        const userInfo = tx.frontUserLoginMaster.update({
            where: { userId },
            data: {
                password,
                updateDate: new Date(),
            },
        });

        return userInfo;
    }
}