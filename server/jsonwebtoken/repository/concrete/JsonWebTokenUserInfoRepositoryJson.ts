import { FrontUserLoginMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { JsonWebTokenUserInfoSelectEntity } from "../../entity/JsonWebTokenUserInfoSelectEntity";
import { JsonWebTokenUserInfoRepositoryInterface } from "../interface/JsonWebTokenUserInfoRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserInfoType } from "../../type/FrontUserInfoType";



/**
 * json形式の永続ロジック用クラス
 */
export class JsonWebTokenUserInfoRepositoryJson implements JsonWebTokenUserInfoRepositoryInterface {


    constructor() {

    }


    /**
     * ユーザー取得
     * @returns 
     */
    async select(JsonWebTokenUserInfoSelectEntity: JsonWebTokenUserInfoSelectEntity):
        Promise<FrontUserInfoType[]> {

        const userId = JsonWebTokenUserInfoSelectEntity.frontUserId;
        const password = JsonWebTokenUserInfoSelectEntity.frontUserPassword;

        // ユーザー情報を取得
        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserInfoType[]>`
            SELECT 
                a.user_id as "userId",
                a.user_name as "userName",
                a.password as "password",
                b.user_birthday as "birthday"
            FROM "front_user_login_master" a 
            INNER JOIN "front_user_info_master" b
            ON a.user_id = CAST(${userId} AS INTEGER) AND
            a.password = ${password} AND
            a.delete_flg = '0' AND
            a.user_id = b.user_id
        `;

        return frontUserList;
    }

}