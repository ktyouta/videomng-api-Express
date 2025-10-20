import { FavoriteVideoTransaction } from "@prisma/client";
import { UpdateFavoriteVideoCustomSelectEntity } from "../../entity/UpdateFavoriteVideoCustomSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFavoriteVideoCustomRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoInsertEntity 
     */
    select(updateFavoriteVideoSelectEntity: UpdateFavoriteVideoCustomSelectEntity): Promise<FavoriteVideoTransaction[]>;

}