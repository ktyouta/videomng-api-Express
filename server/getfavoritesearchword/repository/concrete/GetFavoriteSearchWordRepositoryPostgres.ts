import { FAVORITE_SEARCH_WORD_FETCH_LIMIT } from "../../const/GetFavoriteSearchWordConst";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { FavoriteSearchWordType } from "../../types/FavoriteSearchWordType";
import { GetFavoriteSearchWordRepositoryInterface } from "../interface/GetFavoriteSearchWordInterface";


/**
 * お気に入りワードの永続ロジック用クラス（PostgreSQL）
 */
export class GetFavoriteSearchWordRepositoryPostgres implements GetFavoriteSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入りワード取得
     * @param frontUserIdModel
     * @returns
     */
    async getFavoriteSearchWord(frontUserIdModel: FrontUserIdModel): Promise<FavoriteSearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;

        return await PrismaClientInstance.getInstance().favoriteSearchWordTransaction.findMany({
            select: {
                id: true,
                word: true,
            },
            where: {
                userId,
            },
            orderBy: {
                updateDate: 'desc',
            },
            take: FAVORITE_SEARCH_WORD_FETCH_LIMIT,
        });
    }
}
