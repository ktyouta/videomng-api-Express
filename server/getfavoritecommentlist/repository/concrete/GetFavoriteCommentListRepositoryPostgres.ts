import { FavoriteCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteCommentListSelectEntity } from "../../entity/GetFavoriteCommentListSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteCommentListRepositoryInterface } from "../interface/GetFavoriteCommentListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteCommentListRepositoryPostgres implements GetFavoriteCommentListRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入りコメント取得
     * @returns 
     */
    async select(getFavoriteCommentListSelectEntity: GetFavoriteCommentListSelectEntity): Promise<FavoriteCommentTransaction[]> {

        const frontUserId = getFavoriteCommentListSelectEntity.frontUserId;

        const favoriteVideoFavoriteComment = await PrismaClientInstance.getInstance().$queryRaw<FavoriteCommentTransaction[]>`
            SELECT
                user_id as "userId",
                comment_id as "commentId" 
            FROM "favorite_commnet_transaction" 
            WHERE "user_id" = ${frontUserId} AND
            "delete_flg" = '0'
            `;

        return favoriteVideoFavoriteComment;
    }

}