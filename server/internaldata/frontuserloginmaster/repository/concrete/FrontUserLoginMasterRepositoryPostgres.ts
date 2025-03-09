import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterInsertEntity } from "../../entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterUpdateEntity } from "../../entity/FrontUserLoginMasterUpdateEntity";
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

        const newUserInfo = tx.frontUserLoginMaster.create({
            data: {
                userId,
                password,
                salt,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return newUserInfo;
    }


    /**
     * フロントのユーザー情報を更新
     */
    async update(frontUserLoginMasterUpdateEntity: FrontUserLoginMasterUpdateEntity,
        tx: Prisma.TransactionClient) {

        const userId = frontUserLoginMasterUpdateEntity.frontUserId;
        const password = frontUserLoginMasterUpdateEntity.frontUserPassword;

        const seqData = tx.frontUserLoginMaster.update({
            where: { userId },
            data: {
                password,
                updateDate: new Date(),
            },
        });

        return seqData;
    }
}