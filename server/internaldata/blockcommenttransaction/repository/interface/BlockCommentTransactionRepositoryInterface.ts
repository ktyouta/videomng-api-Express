import { BlockCommentTransaction, Prisma } from "@prisma/client";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { BlockCommentTransactionInsertEntity } from "../../entity/BlockCommentTransactionInsertEntity";


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
     * お気に入り動画を削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    delete(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient): Promise<BlockCommentTransaction>;

    /**
     * お気に入り動画を削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    deleteMany(videoIdModel: VideoIdModel,
        userId: FrontUserIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}

