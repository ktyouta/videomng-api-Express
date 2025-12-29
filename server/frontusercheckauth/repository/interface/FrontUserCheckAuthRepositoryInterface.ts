import { FrontUserInfoType } from "../../../jsonwebtoken/type/FrontUserInfoType";
import { UserSelectEntity } from "../../entity/UserSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserCheckAuthRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(eitity: UserSelectEntity): Promise<FrontUserInfoType[]>;
}