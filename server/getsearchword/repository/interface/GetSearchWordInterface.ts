import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { SearchWordType } from "../../types/SearchWordType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetSearchWordRepositoryInterface {

    /**
     * 最近の検索実績取得
     * @param frontUserIdModel
     */
    getRecentSearchWord(frontUserIdModel: FrontUserIdModel): Promise<SearchWordType[]>;

    /**
     * よく検索するワードを取得
     * @param frontUserIdModel
     */
    getFrequentlySearchWord(frontUserIdModel: FrontUserIdModel): Promise<SearchWordType[]>;
}