import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { GetFavoriteSearchWordRepositoryInterface } from "../repository/interface/GetFavoriteSearchWordInterface";


export class GetFavoriteSearchWordService {

    constructor(private readonly getFavoriteSearchWordRepositoryInterface: GetFavoriteSearchWordRepositoryInterface) { }

    /**
     * お気に入りワードを取得
     * @param frontUserIdModel
     * @returns
     */
    async getFavoriteSearchWord(frontUserIdModel: FrontUserIdModel) {
        return await this.getFavoriteSearchWordRepositoryInterface.getFavoriteSearchWord(frontUserIdModel);
    }
}
