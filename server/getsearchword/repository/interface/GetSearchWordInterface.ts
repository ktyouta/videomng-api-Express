import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { SearchWordType } from "../../types/SearchWordType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetSearchWordRepositoryInterface {

    /**
     * 検索実績取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectSearchWord(frontUserIdModel: FrontUserIdModel): Promise<SearchWordType[]>;
}