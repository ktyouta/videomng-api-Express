import { BlockCommentTransaction, FavoriteCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoBlockCommentSelectEntity } from "../../entity/GetFavoriteVideoBlockCommentSelectEntity";
import { GetFavoriteVideoFavoriteCommentSelectEntity } from "../../entity/GetFavoriteVideoFavoriteCommentSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoCommentRepositoryInterface {

    /**
     * お気に入り動画ブロックコメント取得
     */
    selectBlockComment(getFavoriteVideoBlockCommentSelectEntity: GetFavoriteVideoBlockCommentSelectEntity): Promise<BlockCommentTransaction[]>;

    /**
     * お気に入りコメント取得
     * @param getFavoriteVideoBlockCommentSelectEntity 
     */
    selectFavoriteComment(getFavoriteVideoFavoriteCommentSelectEntity: GetFavoriteVideoFavoriteCommentSelectEntity): Promise<FavoriteCommentTransaction[]>;

}