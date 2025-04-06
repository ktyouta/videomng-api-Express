import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FavoriteCommentTransactionInsertEntity } from "../../entity/FavoriteCommentTransactionInsertEntity";
import { FavoriteCommentTransactionUpdateEntity } from "../../entity/FavoriteCommentTransactionUpdateEntity";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";
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
     * 削除お気に入りコメントの復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const commentId = commentIdModel.commentId;

        const favoriteComment = await tx.favoriteCommentTransaction.update({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            },
            data: {
                deleteFlg: FLG.OFF,
                updateDate: new Date(),
            },
        });

        return favoriteComment;
    }


    /**
     * お気に入りコメントを論理削除
     */
    async softDelete(userIdModel: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const commentId = commentIdModel.commentId;

        const favoriteComment = await tx.favoriteCommentTransaction.update({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteComment;
    }
}