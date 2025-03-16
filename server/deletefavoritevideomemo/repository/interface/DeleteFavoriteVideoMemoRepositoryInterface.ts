import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { DeleteFavoriteVideoDetailSelectEntity } from "../../entity/DeleteFavoriteVideoDetailSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFavoriteVideoMemoRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoMemoInsertEntity 
     */
    select(deleteFavoriteVideoMemoSelectEntity: DeleteFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoTransaction[]>;

}