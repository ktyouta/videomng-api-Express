import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { FavoriteVideoDetailCategoryType } from "../../type/FavoriteVideoDetailCategoryType";
import { FavoriteVideoDetailType } from "../../type/FavoriteVideoDetailType";
import { GetFavoriteVideoCustomSelectEntity } from "../../entity/GetFavoriteVideoCustomSelectEntity";
import { GetFavoriteVideoCustomMemoSelectEntity } from "../../entity/GetFavoriteVideoCustomMemoSelectEntity";
import { GetFavoriteVideoCustomCategorySelectEntity } from "../../entity/GetFavoriteVideoCustomCategorySelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoCustomRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoCustomSelectEntity): Promise<FavoriteVideoDetailType[]>;

    /**
     * お気に入り動画コメント取得
     * @param getFavoriteVideoDetialSelectEntity 
     */
    selectVideoMemo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoCustomMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]>;

    /**
     * お気に入り動画カテゴリ取得
     * @param getFavoriteVideoDetialCategorySelectEntity 
     */
    selectVideoCategory(getFavoriteVideoDetialCategorySelectEntity: GetFavoriteVideoCustomCategorySelectEntity): Promise<FavoriteVideoDetailCategoryType[]>;

}