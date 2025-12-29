import { FrontUserInfoType } from "../../../../common/type/FrontUserInfoType";
import { SelectEntity } from "../../entity/SelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface RepositoryInterface {

    /**
     * ユーザー取得
     */
    select(RefreshSelectEntity: SelectEntity): Promise<FrontUserInfoType[]>;
}