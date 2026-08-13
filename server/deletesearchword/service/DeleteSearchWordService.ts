import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { SearchWordId } from "../../internaldata/searchwordtransaction/properties/SearchWordId";
import { DeleteSearchWordRepositoryInterface } from "../repository/interface/DeleteSearchWordRepositoryInterface";


export class DeleteSearchWordService {

    constructor(private readonly deleteSearchWordRepositoryInterface: DeleteSearchWordRepositoryInterface) { }

    /**
     * 検索実績を削除
     * @param frontUserIdModel
     * @param searchWordId
     * @returns 削除件数
     */
    async deleteSearchWord(frontUserIdModel: FrontUserIdModel, searchWordId: SearchWordId) {
        return await this.deleteSearchWordRepositoryInterface.deleteSearchWord(frontUserIdModel, searchWordId);
    }
}
