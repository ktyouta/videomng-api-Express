import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { GetSearchWordRepositoryInterface } from "../repository/interface/GetSearchWordInterface";


export class GetSearchWordService {

    constructor(private readonly getSearchWordRepositoryInterface: GetSearchWordRepositoryInterface) { }

    /**
     * 最近の検索実績を取得
     * @param frontUserIdModel
     * @returns
     */
    async getRecentSearchWord(frontUserIdModel: FrontUserIdModel) {
        return await this.getSearchWordRepositoryInterface.getRecentSearchWord(frontUserIdModel);
    }

    /**
     * よく検索するワードを取得
     * @param frontUserIdModel 
     * @returns 
     */
    async getFrequentlySearchWord(frontUserIdModel: FrontUserIdModel) {
        return await this.getSearchWordRepositoryInterface.getFrequentlySearchWord(frontUserIdModel);
    }
}