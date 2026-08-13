import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteSearchWord } from "../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWord";

export class CreateFavoriteSearchWordEntity {

    constructor(private readonly _frontUserIdModel: FrontUserIdModel,
        private readonly _favoriteSearchWord: FavoriteSearchWord) { }


    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get favoriteSearchWord() {
        return this._favoriteSearchWord.value;
    }
}