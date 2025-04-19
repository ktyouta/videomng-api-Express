import { FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoListSelectEntity } from "../../entity/GetFavoriteVideoListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoListRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity): Promise<FavoriteVideoTransaction[]>;

}