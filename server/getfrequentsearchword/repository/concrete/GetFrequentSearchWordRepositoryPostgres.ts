import { FREQUENT_SEARCH_WORD_FETCH_LIMIT } from "../../const/GetFrequentSearchWordConst";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { FrequentSearchWordType } from "../../types/FrequentSearchWordType";
import { GetFrequentSearchWordRepositoryInterface } from "../interface/GetFrequentSearchWordInterface";


/**
 * よく検索するワードの永続ロジック用クラス（PostgreSQL）
 */
export class GetFrequentSearchWordRepositoryPostgres implements GetFrequentSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * よく検索するワード取得
     * @param frontUserIdModel
     * @returns
     */
    async getFrequentSearchWord(frontUserIdModel: FrontUserIdModel): Promise<FrequentSearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;

        return await PrismaClientInstance.getInstance().frequentSearchWordTransaction.findMany({
            select: {
                id: true,
                word: true,
            },
            where: {
                userId,
            },
            orderBy: [
                { searchCount: 'desc' },
                { updateDate: 'desc' },
            ],
            take: FREQUENT_SEARCH_WORD_FETCH_LIMIT,
        });
    }
}
