import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { UpdateFavoriteVideoDetailSelectEntity } from "../../entity/UpdateFavoriteVideoDetailSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFavoriteVideoMemoRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoMemoInsertEntity 
     */
    select(updateFavoriteVideoMemoSelectEntity: UpdateFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoTransaction[]>;

}