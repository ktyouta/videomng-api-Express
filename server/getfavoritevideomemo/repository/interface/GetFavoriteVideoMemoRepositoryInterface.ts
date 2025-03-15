import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoMemoSelectEntity } from "../../entity/GetFavoriteVideoMemoSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoMemoRepositoryInterface {

    /**
     * お気に入り動画メモ取得
     * @param getFavoriteVideoMemoSelectEntity 
     */
    selectVideoMemo(getFavoriteVideoMemoSelectEntity: GetFavoriteVideoMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]>;

}