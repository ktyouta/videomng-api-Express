import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrequentSearchWordId } from "../../internaldata/frequentsearchwordtransaction/properties/FrequentSearchWordId";
import { DeleteFrequentSearchWordRepositoryInterface } from "../repository/interface/DeleteFrequentSearchWordRepositoryInterface";


export class DeleteFrequentSearchWordService {

    constructor(private readonly deleteFrequentSearchWordRepositoryInterface: DeleteFrequentSearchWordRepositoryInterface) { }

    /**
     * よく検索するワードを削除
     * @param frontUserIdModel
     * @param frequentSearchWordId
     * @returns 削除件数
     */
    async deleteFrequentSearchWord(frontUserIdModel: FrontUserIdModel, frequentSearchWordId: FrequentSearchWordId) {
        return await this.deleteFrequentSearchWordRepositoryInterface.deleteFrequentSearchWord(frontUserIdModel, frequentSearchWordId);
    }
}
