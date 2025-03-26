import { BlockCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteVideoCommentRepositoryInterface } from "../interface/GetFavoriteVideoCommentRepositoryInterface";
import { GetFavoriteVideoBlockCommentSelectEntity } from "../../entity/GetFavoriteVideoBlockCommentSelectEntity";



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

}