import { FavoriteVideoTagTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoTagListSelectEntity } from "../../entity/GetFavoriteVideoTagListSelectEntity";
import { FavoriteVideoTagType } from "../../type/FavoriteVideoTagType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoTagListRepositoryInterface {

    /**
     * お気に入りコメント取得
     */
    select(getFavoriteVideoTagListSelectEntity: GetFavoriteVideoTagListSelectEntity): Promise<FavoriteVideoTagType[]>;

}