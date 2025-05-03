import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserInfoUpdateSelectEntity } from "../../entity/FrontUserInfoUpdateSelectEntity";
import { FrontUserInfoUpdateRepositoryInterface } from "../interface/FrontUserInfoUpdateRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";



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

        const users = await PrismaClientInstance.getInstance().$queryRaw<FrontUserInfoMaster[]>`
            SELECT * FROM "front_user_info_master" WHERE user_name = ${userName} AND delete_flg = '0'
            `;

        return users;
    }

}