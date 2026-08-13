import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteSearchWordId } from "../../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWordId";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFavoriteSearchWordRepositoryInterface {

    /**
     * お気に入りワード削除
     * @param frontUserIdModel
     * @param favoriteSearchWordId
     */
    deleteFavoriteSearchWord(frontUserIdModel: FrontUserIdModel, favoriteSearchWordId: FavoriteSearchWordId): Promise<number>;
}
