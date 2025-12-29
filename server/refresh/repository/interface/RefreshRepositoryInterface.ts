import { FrontUserInfoType } from "../../../common/type/FrontUserInfoType";
import { RefreshSelectEntity } from "../../entity/RefreshSelectEntity";


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