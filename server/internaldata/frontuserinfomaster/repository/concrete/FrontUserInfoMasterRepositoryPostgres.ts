import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FrontUserInfoMasterInsertEntity } from "../../entity/FrontUserInfoMasterInsertEntity";
import { FrontUserInfoMasterUpdateEntity } from "../../entity/FrontUserInfoMasterUpdateEntity";
import { FrontUserInfoMasterRepositoryInterface } from "../interface/FrontUserInfoMasterRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserInfoMasterRepositoryPostgres implements FrontUserInfoMasterRepositoryInterface {


    constructor() {

    }

    /**
     * フロントのユーザー情報を作成
     */
    async insert(frontUserInfoMasterInsertEntity: FrontUserInfoMasterInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = frontUserInfoMasterInsertEntity.frontUserId;
        const userName = frontUserInfoMasterInsertEntity.frontUserName;
        const userBirthday = frontUserInfoMasterInsertEntity.frontUserBirthDay;

        const newUserInfo = await tx.frontUserInfoMaster.create({
            data: {
                userId,
                userName,
                userBirthday,
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
    async update(frontUserInfoMasterUpdateEntity: FrontUserInfoMasterUpdateEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = frontUserInfoMasterUpdateEntity.frontUserId;
        const userName = frontUserInfoMasterUpdateEntity.frontUserName;
        const userBirthday = frontUserInfoMasterUpdateEntity.frontUserBirthDay;

        const seqData = await tx.frontUserInfoMaster.update({
            where: { userId },
            data: {
                userName,
                userBirthday,
                updateDate: new Date(),
            },
        });

        return seqData;
    }
}