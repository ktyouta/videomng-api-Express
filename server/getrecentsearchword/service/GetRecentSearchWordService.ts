import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { GetRecentSearchWordRepositoryInterface } from "../repository/interface/GetRecentSearchWordInterface";


export class GetRecentSearchWordService {

    constructor(private readonly getRecentSearchWordRepositoryInterface: GetRecentSearchWordRepositoryInterface) { }

    /**
     * 最近の検索実績を取得
     * @param frontUserIdModel
     * @returns
     */
    async getRecentSearchWord(frontUserIdModel: FrontUserIdModel) {
        return await this.getRecentSearchWordRepositoryInterface.getRecentSearchWord(frontUserIdModel);
    }
}
