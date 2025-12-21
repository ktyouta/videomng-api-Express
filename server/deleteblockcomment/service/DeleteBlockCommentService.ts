import { Prisma } from "@prisma/client";
import { BlockCommentTransactionRepositorys } from "../../internaldata/blockcommenttransaction/repository/BlockCommentTransactionRepositorys";
import { BlockCommentTransactionRepositoryInterface } from "../../internaldata/blockcommenttransaction/repository/interface/BlockCommentTransactionRepositoryInterface";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RepositoryType } from "../../util/const/CommonConst";


export class DeleteBlockCommentService {

    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getBlockCommentRepository(): BlockCommentTransactionRepositoryInterface {
        return (new BlockCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * ブロックコメントを削除する
     * @param blockCommentRepository 
     * @param deleteBlockCommentRequestModel 
     * @param frontUserIdModel 
     */
    public async softDelete(blockCommentRepository: BlockCommentTransactionRepositoryInterface,
        commentIdModel: CommentIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // ブロックコメント削除
        const blockComment = await blockCommentRepository.softDelete(frontUserIdModel, commentIdModel, tx);

        return blockComment;
    }

}