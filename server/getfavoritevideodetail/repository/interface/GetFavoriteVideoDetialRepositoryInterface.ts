import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoDetialMemoSelectEntity } from "../../entity/GetFavoriteVideoDetialMemoSelectEntity";
import { GetFavoriteVideoDetialSelectEntity } from "../../entity/GetFavoriteVideoDetialSelectEntity";
import { GetFavoriteVideoDetialCategorySelectEntity } from "../../entity/GetFavoriteVideoDetialCategorySelectEntity";
import { FavoriteVideoDetailCategoryType } from "../../type/FavoriteVideoDetailCategoryType";
import { FavoriteVideoDetailType } from "../../type/FavoriteVideoDetailType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoDetialRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialSelectEntity): Promise<FavoriteVideoDetailType[]>;

    /**
     * お気に入り動画コメント取得
     * @param getFavoriteVideoDetialSelectEntity 
     */
    selectVideoMemo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]>;

    /**
     * お気に入り動画カテゴリ取得
     * @param getFavoriteVideoDetialCategorySelectEntity 
     */
    selectVideoCategory(getFavoriteVideoDetialCategorySelectEntity: GetFavoriteVideoDetialCategorySelectEntity): Promise<FavoriteVideoDetailCategoryType[]>;

}