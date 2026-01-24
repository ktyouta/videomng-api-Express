import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { BlockCommentTransactionInsertEntity } from "../../entity/BlockCommentTransactionInsertEntity";
import { BlockCommentTransactionRepositoryInterface } from "../interface/BlockCommentTransactionRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class BlockCommentTransactionRepositoryPostgres implements BlockCommentTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * ブロックコメント情報を作成
     */
    async insert(blockCommentTransactionInsertEntity: BlockCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = blockCommentTransactionInsertEntity.frontUserId;
        const commentId = blockCommentTransactionInsertEntity.commentId;
        const videoId = blockCommentTransactionInsertEntity.videoId;

        const blockComment = await tx.blockCommentTransaction.create({
            data: {
                userId,
                commentId,
                videoId,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return blockComment;
    }


    /**
     * 削除ブロックコメントの復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const commentId = commentIdModel.commentId;

        const blockComment = await tx.blockCommentTransaction.update({
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

        return blockComment;
    }

    /**
     * ブロックコメントを削除
     */
    async delete(userIdModel: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const commentId = commentIdModel.commentId;

        const blockComment = await tx.blockCommentTransaction.delete({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        });

        return blockComment;
    }

    /**
     * ブロックコメントを削除
     */
    async deleteMany(videoIdModel: VideoIdModel,
        userIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const blockComment = await tx.blockCommentTransaction.deleteMany({
            where: {
                userId,
                videoId
            }
        });

        return blockComment;
    }
}