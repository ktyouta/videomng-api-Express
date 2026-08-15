import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { RecentSearchWordId } from "../../../internaldata/recentsearchwordtransaction/properties/RecentSearchWordId";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteRecentSearchWordRepositoryInterface {

    /**
     * 最近の検索実績削除
     * @param frontUserIdModel
     * @param recentSearchWordId
     */
    deleteRecentSearchWord(frontUserIdModel: FrontUserIdModel, recentSearchWordId: RecentSearchWordId): Promise<number>;
}
