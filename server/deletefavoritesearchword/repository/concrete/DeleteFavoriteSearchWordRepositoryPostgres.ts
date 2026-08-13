import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteSearchWordId } from "../../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWordId";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { DeleteFavoriteSearchWordRepositoryInterface } from "../interface/DeleteFavoriteSearchWordRepositoryInterface";


/**
 * お気に入りワードの永続ロジック用クラス（PostgreSQL）
 */
export class DeleteFavoriteSearchWordRepositoryPostgres implements DeleteFavoriteSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入りワード削除
     * @param frontUserIdModel
     * @param favoriteSearchWordId
     * @returns 削除件数
     */
    async deleteFavoriteSearchWord(frontUserIdModel: FrontUserIdModel, favoriteSearchWordId: FavoriteSearchWordId): Promise<number> {

        const userId = frontUserIdModel.frontUserId;
        const id = favoriteSearchWordId.id;

        const result = await PrismaClientInstance.getInstance().favoriteSearchWordTransaction.deleteMany({
            where: {
                id,
                userId,
            },
        });

        return result.count;
    }
}
