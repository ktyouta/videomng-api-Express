import { FavoriteVideoTransaction } from "@prisma/client";
import { CreateFavoriteVideoSelectEntity } from "../../entity/CreateFavoriteVideoSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFavoriteVideoRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoInsertEntity 
     */
    select(createFavoriteVideoSelectEntity: CreateFavoriteVideoSelectEntity): Promise<FavoriteVideoTransaction[]>;
}