import { RefreshSelectEntity } from "../../entity/RefreshSelectEntity";
import { FrontUserInfoType } from "../../type/FrontUserInfoType";


/**
 * 永続ロジック用インターフェース
 */
export interface RefreshRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(RefreshSelectEntity: RefreshSelectEntity):
        Promise<FrontUserInfoType[]>;

}