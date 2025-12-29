import { SelectEntity } from "../../entity/SelectEntity";
import { FrontUserInfoType } from "../../type/FrontUserInfoType";


/**
 * 永続ロジック用インターフェース
 */
export interface RepositoryInterface {

    /**
     * ユーザー取得
     */
    select(RefreshSelectEntity: SelectEntity): Promise<FrontUserInfoType[]>;
}