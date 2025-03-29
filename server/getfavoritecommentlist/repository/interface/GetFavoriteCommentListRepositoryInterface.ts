import { FavoriteCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteCommentListSelectEntity } from "../../entity/GetFavoriteCommentListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteCommentListRepositoryInterface {

    /**
     * お気に入りコメント取得
     */
    select(getFavoriteCommentListSelectEntity: GetFavoriteCommentListSelectEntity): Promise<FavoriteCommentTransaction[]>;

}