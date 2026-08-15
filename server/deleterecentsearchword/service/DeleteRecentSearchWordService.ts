import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RecentSearchWordId } from "../../internaldata/recentsearchwordtransaction/properties/RecentSearchWordId";
import { DeleteRecentSearchWordRepositoryInterface } from "../repository/interface/DeleteRecentSearchWordRepositoryInterface";


export class DeleteRecentSearchWordService {

    constructor(private readonly deleteRecentSearchWordRepositoryInterface: DeleteRecentSearchWordRepositoryInterface) { }

    /**
     * 最近の検索実績を削除
     * @param frontUserIdModel
     * @param recentSearchWordId
     * @returns 削除件数
     */
    async deleteRecentSearchWord(frontUserIdModel: FrontUserIdModel, recentSearchWordId: RecentSearchWordId) {
        return await this.deleteRecentSearchWordRepositoryInterface.deleteRecentSearchWord(frontUserIdModel, recentSearchWordId);
    }
}
