import { FrontUserInfoType } from "../../../common/type/FrontUserInfoType";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { UserSelectEntity } from "../../entity/UserSelectEntity";
import { FrontUserCheckAuthRepositoryInterface } from "../interface/FrontUserCheckAuthRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserCheckAuthRepositoryJson implements FrontUserCheckAuthRepositoryInterface {


    constructor() { }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(eitity: UserSelectEntity): Promise<FrontUserInfoType[]> {

        const userId = eitity.frontUserId;

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