import { FavoriteVideoTagTransaction } from "@prisma/client";
import { UpdateFavoriteVideoTagSelectEntity } from "../../entity/UpdateFavoriteVideoTagSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFavoriteVideoTagRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoTagInsertEntity 
     */
    select(updateFavoriteVideoTagSelectEntity: UpdateFavoriteVideoTagSelectEntity): Promise<FavoriteVideoTagTransaction[]>;

}