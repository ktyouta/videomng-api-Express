import { SEARCH_WORD_FETCH_LIMIT } from "../../const/GetSearchWordConst";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SearchWordType } from "../../types/SearchWordType";
import { GetSearchWordRepositoryInterface } from "../interface/GetSearchWordInterface";


/**
 * 検索実績の永続ロジック用クラス（PostgreSQL）
 */
export class GetSearchWordRepositoryPostgres implements GetSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * 検索実績取得
     * @param frontUserIdModel
     * @returns
     */
    async getRecentSearchWord(frontUserIdModel: FrontUserIdModel): Promise<SearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;

        return await PrismaClientInstance.getInstance().searchWordTransaction.findMany({
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
            take: SEARCH_WORD_FETCH_LIMIT,
        });
    }

    /**
     * よく検索するワードを取得
     * @param frontUserIdModel
     * @returns
     */
    async getFrequentlySearchWord(frontUserIdModel: FrontUserIdModel): Promise<SearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;

        return await PrismaClientInstance.getInstance().searchWordTransaction.findMany({
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
            take: SEARCH_WORD_FETCH_LIMIT,
        });
    }
}
