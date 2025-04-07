import { BlockCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetBlockCommentListSelectEntity } from "../../entity/GetBlockCommentListSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetBlockCommentListRepositoryInterface } from "../interface/GetBlockCommentListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetBlockCommentListRepositoryPostgres implements GetBlockCommentListRepositoryInterface {

    constructor() {
    }

    /**
     * ブロックコメント取得
     * @returns 
     */
    async select(getBlockCommentListSelectEntity: GetBlockCommentListSelectEntity): Promise<BlockCommentTransaction[]> {

        const frontUserId = getBlockCommentListSelectEntity.frontUserId;
        const videoId = getBlockCommentListSelectEntity.videoId;

        const favoriteVideoBlockComment = await PrismaClientInstance.getInstance().$queryRaw<BlockCommentTransaction[]>`
            SELECT
                user_id as "userId",
                comment_id as "commentId" 
            FROM "block_commnet_transaction" 
            WHERE "user_id" = ${frontUserId} AND
            "video_id" = ${videoId} AND
            "delete_flg" = '0'
            `;

        return favoriteVideoBlockComment;
    }

}