import { BlockCommentTransactionUpdateEntity } from "../../entity/BlockCommentTransactionUpdateEntity";
import { BlockCommentTransactionInsertEntity } from "../../entity/BlockCommentTransactionInsertEntity";
import { BlockCommentTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../frontuserinfomaster/properties/FrontUserIdModel";
import { CommentIdModel } from "../../properties/CommentIdModel";


/**
 * 永続ロジック用インターフェース
 */
export interface BlockCommentTransactionRepositoryInterface {

    /**
     * お気に入り動画情報を作成
     */
    insert(blockCommentTransactionInsertEntity: BlockCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<BlockCommentTransaction>;

    /**
     * 削除動画の復元
     */
    recovery(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient): Promise<BlockCommentTransaction>;

    /**
     * お気に入り動画を論理削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    softDelete(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient): Promise<BlockCommentTransaction>;
}

