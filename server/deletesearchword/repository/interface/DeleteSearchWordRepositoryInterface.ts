import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { SearchWordId } from "../../../internaldata/searchwordtransaction/properties/SearchWordId";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteSearchWordRepositoryInterface {

    /**
     * 検索実績削除
     * @param frontUserIdModel
     * @param searchWordId
     */
    deleteSearchWord(frontUserIdModel: FrontUserIdModel, searchWordId: SearchWordId): Promise<number>;
}
