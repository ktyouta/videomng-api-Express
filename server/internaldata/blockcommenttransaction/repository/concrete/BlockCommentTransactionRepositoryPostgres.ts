import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { BlockCommentTransactionInsertEntity } from "../../entity/BlockCommentTransactionInsertEntity";
import { BlockCommentTransactionUpdateEntity } from "../../entity/BlockCommentTransactionUpdateEntity";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { BlockCommentTransactionRepositoryInterface } from "../interface/BlockCommentTransactionRepositoryInterface";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";



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
     * ブロックコメントを論理削除
     */
    async softDelete(userIdModel: FrontUserIdModel,
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
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return blockComment;
    }
}