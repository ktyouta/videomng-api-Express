import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { SelectEntity } from "../../entity/SelectEntity";
import { FrontUserInfoType } from "../../type/FrontUserInfoType";
import { RepositoryInterface } from "../interface/RepositoryInterface";


/**
 * json形式の永続ロジック用クラス
 */
export class RepositoryJson implements RepositoryInterface {


    constructor() {

    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(SelectEntity: SelectEntity): Promise<FrontUserInfoType[]> {

        const userId = SelectEntity.frontUserId;

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