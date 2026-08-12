import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { GetSearchWordRepositoryInterface } from "../repository/interface/GetSearchWordInterface";


export class GetSearchWordService {

    constructor(private readonly getSearchWordRepositoryInterface: GetSearchWordRepositoryInterface) { }

    /**
     * 検索実績を取得
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getSearchWord(frontUserIdModel: FrontUserIdModel) {
        const folderList = await this.getSearchWordRepositoryInterface.selectSearchWord(frontUserIdModel);
        return folderList;
    }
}