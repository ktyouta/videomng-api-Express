import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FrequentSearchWordId } from "../../../internaldata/frequentsearchwordtransaction/properties/FrequentSearchWordId";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFrequentSearchWordRepositoryInterface {

    /**
     * よく検索するワード削除
     * @param frontUserIdModel
     * @param frequentSearchWordId
     */
    deleteFrequentSearchWord(frontUserIdModel: FrontUserIdModel, frequentSearchWordId: FrequentSearchWordId): Promise<number>;
}
