import { BlockCommentTransaction, FavoriteCommentTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetFavoriteVideoBlockCommentSelectEntity } from "../../entity/GetFavoriteVideoBlockCommentSelectEntity";
import { GetFavoriteVideoFavoriteCommentSelectEntity } from "../../entity/GetFavoriteVideoFavoriteCommentSelectEntity";
import { GetFavoriteVideoCommentRepositoryInterface } from "../interface/GetFavoriteVideoCommentRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoCommentRepositoryPostgres implements GetFavoriteVideoCommentRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画ブロックコメント取得
     * @returns 
     */
    async selectBlockComment(getFavoriteVideoBlockCommentSelectEntity: GetFavoriteVideoBlockCommentSelectEntity): Promise<BlockCommentTransaction[]> {

        const frontUserId = getFavoriteVideoBlockCommentSelectEntity.frontUserId;

        const favoriteVideoBlockComment = await PrismaClientInstance.getInstance().$queryRaw<BlockCommentTransaction[]>`
            SELECT
                user_id as "userId",
                comment_id as "commentId" 
            FROM "block_commnet_transaction" 
            WHERE "user_id" = ${frontUserId} AND
            "delete_flg" = '0'
            `;

        return favoriteVideoBlockComment;
    }


    /**
     * お気に入りコメント取得
     * @returns 
     */
    async selectFavoriteComment(getFavoriteVideoFavoriteCommentSelectEntity: GetFavoriteVideoFavoriteCommentSelectEntity): Promise<FavoriteCommentTransaction[]> {

        const frontUserId = getFavoriteVideoFavoriteCommentSelectEntity.frontUserId;

        const favoriteComment = await PrismaClientInstance.getInstance().$queryRaw<FavoriteCommentTransaction[]>`
            SELECT
                user_id as "userId",
                comment_id as "commentId" 
            FROM "favorite_commnet_transaction" 
            WHERE "user_id" = ${frontUserId} AND
            "delete_flg" = '0'
            `;

        return favoriteComment;
    }
}