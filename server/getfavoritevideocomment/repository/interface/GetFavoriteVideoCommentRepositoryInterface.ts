import { BlockCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoBlockCommentSelectEntity } from "../../entity/GetFavoriteVideoBlockCommentSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoCommentRepositoryInterface {

    /**
     * お気に入り動画ブロックコメント取得
     */
    selectBlockComment(getFavoriteVideoBlockCommentSelectEntity: GetFavoriteVideoBlockCommentSelectEntity): Promise<BlockCommentTransaction[]>;

}