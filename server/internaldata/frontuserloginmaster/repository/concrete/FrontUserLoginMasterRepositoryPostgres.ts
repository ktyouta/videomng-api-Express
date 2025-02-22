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
    async insert(frontUserLoginMasterInsertEntity: FrontUserLoginMasterInsertEntity) {

        const userId = frontUserLoginMasterInsertEntity.frontUserId;
        const password = frontUserLoginMasterInsertEntity.frontUserPassword;

        const newUserInfo = PrismaClientInstance.getInstance().frontUserLoginMaster.create({
            data: {
                userId,
                password,
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
    async update(frontUserLoginMasterUpdateEntity: FrontUserLoginMasterUpdateEntity) {

        const userId = frontUserLoginMasterUpdateEntity.frontUserId;
        const password = frontUserLoginMasterUpdateEntity.frontUserPassword;

        const seqData = PrismaClientInstance.getInstance().frontUserLoginMaster.update({
            where: { userId },
            data: {
                password,
                updateDate: new Date(),
            },
        });

        return seqData;
    }
}