import { RECENT_SEARCH_WORD_FETCH_LIMIT } from "../../const/GetRecentSearchWordConst";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { RecentSearchWordType } from "../../types/RecentSearchWordType";
import { GetRecentSearchWordRepositoryInterface } from "../interface/GetRecentSearchWordInterface";


/**
 * 最近の検索実績の永続ロジック用クラス（PostgreSQL）
 */
export class GetRecentSearchWordRepositoryPostgres implements GetRecentSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * 最近の検索実績取得
     * @param frontUserIdModel
     * @returns
     */
    async getRecentSearchWord(frontUserIdModel: FrontUserIdModel): Promise<RecentSearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;

        return await PrismaClientInstance.getInstance().recentSearchWordTransaction.findMany({
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
            take: RECENT_SEARCH_WORD_FETCH_LIMIT,
        });
    }
}
