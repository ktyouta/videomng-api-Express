import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FrequentSearchWordId } from "../../../internaldata/frequentsearchwordtransaction/properties/FrequentSearchWordId";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { DeleteFrequentSearchWordRepositoryInterface } from "../interface/DeleteFrequentSearchWordRepositoryInterface";


/**
 * よく検索するワードの永続ロジック用クラス（PostgreSQL）
 */
export class DeleteFrequentSearchWordRepositoryPostgres implements DeleteFrequentSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * よく検索するワード削除
     * @param frontUserIdModel
     * @param frequentSearchWordId
     * @returns 削除件数
     */
    async deleteFrequentSearchWord(frontUserIdModel: FrontUserIdModel, frequentSearchWordId: FrequentSearchWordId): Promise<number> {

        const userId = frontUserIdModel.frontUserId;
        const id = frequentSearchWordId.id;

        const result = await PrismaClientInstance.getInstance().frequentSearchWordTransaction.deleteMany({
            where: {
                id,
                userId,
            },
        });

        return result.count;
    }
}
