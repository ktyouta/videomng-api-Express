import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteCommentTransactionInsertEntity } from "../../entity/FavoriteCommentTransactionInsertEntity";
import { FavoriteCommentTransactionRepositoryInterface } from "../interface/FavoriteCommentTransactionRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteCommentTransactionRepositoryPostgres implements FavoriteCommentTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * お気に入りコメント情報を作成
     */
    async insert(favoriteCommentTransactionInsertEntity: FavoriteCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteCommentTransactionInsertEntity.frontUserId;
        const commentId = favoriteCommentTransactionInsertEntity.commentId;
        const videoId = favoriteCommentTransactionInsertEntity.videoId;

        const favoriteComment = await tx.favoriteCommentTransaction.create({
            data: {
                userId,
                commentId,
                videoId,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteComment;
    }

    /**
     * お気に入りコメントを削除
     */
    async delete(userIdModel: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const commentId = commentIdModel.commentId;

        const favoriteComment = await tx.favoriteCommentTransaction.delete({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        });

        return favoriteComment;
    }

    /**
     * お気に入りコメントを削除
     */
    async deleteMany(videoIdModel: VideoIdModel,
        userIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteComment = await tx.favoriteCommentTransaction.deleteMany({
            where: {
                userId,
                videoId,
            }
        });

        return favoriteComment;
    }
}