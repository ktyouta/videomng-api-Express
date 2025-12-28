import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { FrontUserLoginMasterInsertEntity } from "../../entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterUpdateUserInfoEntity } from "../../entity/FrontUserLoginMasterUpdateUserInfoEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../interface/FrontUserLoginMasterRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserLoginMasterRepositoryPostgres implements FrontUserLoginMasterRepositoryInterface {


    constructor() {

    }

    /**
     * フロントのユーザー情報を作成
     */
    async insert(frontUserLoginMasterInsertEntity: FrontUserLoginMasterInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = frontUserLoginMasterInsertEntity.frontUserId;
        const password = frontUserLoginMasterInsertEntity.frontUserPassword;
        const salt = frontUserLoginMasterInsertEntity.salt;
        const userName = frontUserLoginMasterInsertEntity.frontUserName;

        const newUserInfo = tx.frontUserLoginMaster.create({
            data: {
                userId,
                password,
                salt,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
                userName,
            },
        });

        return newUserInfo;
    }

    /**
     * フロントのユーザー情報を更新
     */
    async updateUserInfo(frontUserLoginMasterUpdateUserInfoEntity: FrontUserLoginMasterUpdateUserInfoEntity,
        tx: Prisma.TransactionClient) {

        const userId = frontUserLoginMasterUpdateUserInfoEntity.frontUserId;
        const userName = frontUserLoginMasterUpdateUserInfoEntity.frontUserName;

        const userInfo = tx.frontUserLoginMaster.update({
            where: { userId },
            data: {
                userName,
                updateDate: new Date(),
            },
        });

        return userInfo;
    }
}