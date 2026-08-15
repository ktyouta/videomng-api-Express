import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { GetFrequentSearchWordRepositoryInterface } from "../repository/interface/GetFrequentSearchWordInterface";


export class GetFrequentSearchWordService {

    constructor(private readonly getFrequentSearchWordRepositoryInterface: GetFrequentSearchWordRepositoryInterface) { }

    /**
     * よく検索するワードを取得
     * @param frontUserIdModel
     * @returns
     */
    async getFrequentSearchWord(frontUserIdModel: FrontUserIdModel) {
        return await this.getFrequentSearchWordRepositoryInterface.getFrequentSearchWord(frontUserIdModel);
    }
}
