import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoDetialSelectEntity } from "../../entity/GetFavoriteVideoDetialSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoDetialRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialSelectEntity): Promise<FavoriteVideoTransaction[]>;

    /**
     * お気に入り動画コメント取得
     * @param getFavoriteVideoDetialSelectEntity 
     */
    selectVideoMemo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialSelectEntity): Promise<FavoriteVideoMemoTransaction[]>;

}