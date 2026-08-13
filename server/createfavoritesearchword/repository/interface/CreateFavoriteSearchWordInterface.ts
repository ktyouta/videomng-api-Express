import { FavoriteSearchWordTransaction } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { CreateFavoriteSearchWordEntity } from "../../entity/CreateFavoriteSearchWordEntity";
import { FavoriteSearchWordType } from "../../types/FavoriteSearchWordType";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFavoriteSearchWordRepositoryInterface {

    /**
     * お気に入りワード取得
     * @param frontUserIdModel
     */
    getFavoriteSearchWord(frontUserIdModel: FrontUserIdModel): Promise<FavoriteSearchWordType[]>;

    /**
     * お気に入りワード登録
     * @param entity
     */
    insert(entity: CreateFavoriteSearchWordEntity): Promise<FavoriteSearchWordTransaction>;
}
