import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteSearchWordType } from "../../types/FavoriteSearchWordType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteSearchWordRepositoryInterface {

    /**
     * お気に入りワード取得
     * @param frontUserIdModel
     */
    getFavoriteSearchWord(frontUserIdModel: FrontUserIdModel): Promise<FavoriteSearchWordType[]>;
}
