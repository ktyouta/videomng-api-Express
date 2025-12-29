import { FrontUserInfoType } from "../../../common/type/FrontUserInfoType";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { RefreshSelectEntity } from "../../entity/RefreshSelectEntity";
import { RefreshRepositoryInterface } from "../interface/RefreshRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class RefreshRepositoryJson implements RefreshRepositoryInterface {


    constructor() {

    }


    /**
     * ユーザー取得
     * @returns 
     */
    async select(RefreshSelectEntity: RefreshSelectEntity):
        Promise<FrontUserInfoType[]> {

        const userId = RefreshSelectEntity.frontUserId;

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
            a.delete_flg = '0' AND
            a.user_id = b.user_id
        `;

        return frontUserList;
    }

}