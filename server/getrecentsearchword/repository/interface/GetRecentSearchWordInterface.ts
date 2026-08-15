import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { RecentSearchWordType } from "../../types/RecentSearchWordType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetRecentSearchWordRepositoryInterface {

    /**
     * 最近の検索実績取得
     * @param frontUserIdModel
     */
    getRecentSearchWord(frontUserIdModel: FrontUserIdModel): Promise<RecentSearchWordType[]>;
}
