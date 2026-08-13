import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { SearchWordId } from "../../../internaldata/searchwordtransaction/properties/SearchWordId";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { DeleteSearchWordRepositoryInterface } from "../interface/DeleteSearchWordRepositoryInterface";


/**
 * 検索実績の永続ロジック用クラス（PostgreSQL）
 */
export class DeleteSearchWordRepositoryPostgres implements DeleteSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * 検索実績削除
     * @param frontUserIdModel
     * @param searchWordId
     * @returns 削除件数
     */
    async deleteSearchWord(frontUserIdModel: FrontUserIdModel, searchWordId: SearchWordId): Promise<number> {

        const userId = frontUserIdModel.frontUserId;
        const id = searchWordId.id;

        const result = await PrismaClientInstance.getInstance().searchWordTransaction.deleteMany({
            where: {
                id,
                userId,
            },
        });

        return result.count;
    }
}
