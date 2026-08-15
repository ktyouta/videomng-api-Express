import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FrequentSearchWordType } from "../../types/FrequentSearchWordType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFrequentSearchWordRepositoryInterface {

    /**
     * よく検索するワード取得
     * @param frontUserIdModel
     */
    getFrequentSearchWord(frontUserIdModel: FrontUserIdModel): Promise<FrequentSearchWordType[]>;
}
