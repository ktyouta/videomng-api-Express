import { BlockCommentTransaction, FavoriteCommentTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { SearchCommentByKeywordBlockCommentSelectEntity } from "../../entity/SearchCommentByKeywordBlockCommentSelectEntity";
import { SearchCommentByKeywordFavoriteCommentSelectEntity } from "../../entity/SearchCommentByKeywordFavoriteCommentSelectEntity";
import { GetFavoriteVideoCommentRepositoryInterface } from "../interface/GetFavoriteVideoCommentRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class SearchCommentByKeywordRepositoryPostgres implements GetFavoriteVideoCommentRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画ブロックコメント取得
     * @returns 
     */
    async selectBlockComment(searchCommentByKeywordBlockCommentSelectEntity: SearchCommentByKeywordBlockCommentSelectEntity): Promise<BlockCommentTransaction[]> {

        const frontUserId = searchCommentByKeywordBlockCommentSelectEntity.frontUserId;
        const videoId = searchCommentByKeywordBlockCommentSelectEntity.videoId;

        const favoriteVideoBlockComment = await PrismaClientInstance.getInstance().$queryRaw<BlockCommentTransaction[]>`
            SELECT
                user_id as "userId",
                comment_id as "commentId" 
            FROM "block_commnet_transaction" 
            WHERE 
                "user_id" = CAST(${frontUserId} AS INTEGER) AND
                "video_id" = ${videoId} AND
                "delete_flg" = '0'
            `;

        return favoriteVideoBlockComment;
    }


    /**
     * お気に入りコメント取得
     * @returns 
     */
    async selectFavoriteComment(searchCommentByKeywordFavoriteCommentSelectEntity: SearchCommentByKeywordFavoriteCommentSelectEntity): Promise<FavoriteCommentTransaction[]> {

        const frontUserId = searchCommentByKeywordFavoriteCommentSelectEntity.frontUserId;
        const videoId = searchCommentByKeywordFavoriteCommentSelectEntity.videoId;

        const favoriteComment = await PrismaClientInstance.getInstance().$queryRaw<FavoriteCommentTransaction[]>`
            SELECT
                user_id as "userId",
                comment_id as "commentId" 
            FROM "favorite_commnet_transaction" 
            WHERE 
                "user_id" = CAST(${frontUserId} AS INTEGER) AND
                "video_id" = ${videoId} AND
                "delete_flg" = '0'
            `;

        return favoriteComment;
    }
}