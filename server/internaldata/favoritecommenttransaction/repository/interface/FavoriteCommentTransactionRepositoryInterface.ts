import { FavoriteCommentTransaction, Prisma } from "@prisma/client";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteCommentTransactionInsertEntity } from "../../entity/FavoriteCommentTransactionInsertEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteCommentTransactionRepositoryInterface {

    /**
     * お気に入りコメント情報を作成
     */
    insert(favoriteCommentTransactionInsertEntity: FavoriteCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteCommentTransaction>;

    /**
     * お気に入りコメントを削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    delete(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient): Promise<FavoriteCommentTransaction>;

    /**
     * お気に入りコメントを削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    deleteMany(videoIdModel: VideoIdModel,
        userId: FrontUserIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}

