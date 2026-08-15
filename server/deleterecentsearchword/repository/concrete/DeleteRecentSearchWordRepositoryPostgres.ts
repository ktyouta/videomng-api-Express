import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { RecentSearchWordId } from "../../../internaldata/recentsearchwordtransaction/properties/RecentSearchWordId";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { DeleteRecentSearchWordRepositoryInterface } from "../interface/DeleteRecentSearchWordRepositoryInterface";


/**
 * 最近の検索実績の永続ロジック用クラス（PostgreSQL）
 */
export class DeleteRecentSearchWordRepositoryPostgres implements DeleteRecentSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * 最近の検索実績削除
     * @param frontUserIdModel
     * @param recentSearchWordId
     * @returns 削除件数
     */
    async deleteRecentSearchWord(frontUserIdModel: FrontUserIdModel, recentSearchWordId: RecentSearchWordId): Promise<number> {

        const userId = frontUserIdModel.frontUserId;
        const id = recentSearchWordId.id;

        const result = await PrismaClientInstance.getInstance().recentSearchWordTransaction.deleteMany({
            where: {
                id,
                userId,
            },
        });

        return result.count;
    }
}
