import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteSearchWordId } from "../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWordId";
import { DeleteFavoriteSearchWordRepositoryInterface } from "../repository/interface/DeleteFavoriteSearchWordRepositoryInterface";


export class DeleteFavoriteSearchWordService {

    constructor(private readonly deleteFavoriteSearchWordRepositoryInterface: DeleteFavoriteSearchWordRepositoryInterface) { }

    /**
     * お気に入りワードを削除
     * @param frontUserIdModel
     * @param favoriteSearchWordId
     * @returns 削除件数
     */
    async deleteFavoriteSearchWord(frontUserIdModel: FrontUserIdModel, favoriteSearchWordId: FavoriteSearchWordId) {
        return await this.deleteFavoriteSearchWordRepositoryInterface.deleteFavoriteSearchWord(frontUserIdModel, favoriteSearchWordId);
    }
}
