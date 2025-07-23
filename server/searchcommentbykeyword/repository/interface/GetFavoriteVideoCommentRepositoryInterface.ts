import { BlockCommentTransaction, FavoriteCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { SearchCommentByKeywordFavoriteCommentSelectEntity } from "../../entity/SearchCommentByKeywordFavoriteCommentSelectEntity";
import { SearchCommentByKeywordBlockCommentSelectEntity } from "../../entity/SearchCommentByKeywordBlockCommentSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoCommentRepositoryInterface {

    /**
     * お気に入り動画ブロックコメント取得
     */
    selectBlockComment(searchCommentByKeywordBlockCommentSelectEntity: SearchCommentByKeywordBlockCommentSelectEntity): Promise<BlockCommentTransaction[]>;

    /**
     * お気に入りコメント取得
     * @param searchCommentByKeywordFavoriteCommentSelectEntity 
     */
    selectFavoriteComment(searchCommentByKeywordFavoriteCommentSelectEntity: SearchCommentByKeywordFavoriteCommentSelectEntity): Promise<FavoriteCommentTransaction[]>;

}