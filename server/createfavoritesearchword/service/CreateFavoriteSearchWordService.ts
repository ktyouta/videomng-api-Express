import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteSearchWord } from "../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWord";
import { CreateFavoriteSearchWordEntity } from "../entity/CreateFavoriteSearchWordEntity";
import { CreateFavoriteSearchWordRepositoryInterface } from "../repository/interface/CreateFavoriteSearchWordInterface";


export class CreateFavoriteSearchWordService {

    constructor(private readonly createFavoriteSearchWordRepositoryInterface: CreateFavoriteSearchWordRepositoryInterface) { }

    /**
     * お気に入りワードを取得
     * @param frontUserIdModel
     * @returns
     */
    async getFavoriteSearchWord(frontUserIdModel: FrontUserIdModel) {
        return await this.createFavoriteSearchWordRepositoryInterface.getFavoriteSearchWord(frontUserIdModel);
    }

    /**
     * お気に入りワードを登録
     * @param frontUserIdModel
     * @param favoriteSearchWord
     * @returns
     */
    async insertFavoriteSearchWord(frontUserIdModel: FrontUserIdModel,
        favoriteSearchWord: FavoriteSearchWord
    ) {
        const createFavoriteSearchWordEntity = new CreateFavoriteSearchWordEntity(frontUserIdModel, favoriteSearchWord);

        return await this.createFavoriteSearchWordRepositoryInterface.insert(createFavoriteSearchWordEntity);
    }
}
