import { FavoriteVideoTransaction } from "@prisma/client";
import { UpdateFavoriteVideoSelectEntity } from "../../entity/UpdateFavoriteVideoSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFavoriteVideoRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoInsertEntity 
     */
    select(updateFavoriteVideoSelectEntity: UpdateFavoriteVideoSelectEntity): Promise<FavoriteVideoTransaction[]>;

}