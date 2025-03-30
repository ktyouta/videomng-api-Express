import { FavoriteCommentTransactionUpdateEntity } from "../../entity/FavoriteCommentTransactionUpdateEntity";
import { FavoriteCommentTransactionInsertEntity } from "../../entity/FavoriteCommentTransactionInsertEntity";
import { FavoriteCommentTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../frontuserinfomaster/properties/FrontUserIdModel";
import { CommentIdModel } from "../../../common/properties/CommentIdModel";


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
     * 削除お気に入りコメントの復元
     */
    recovery(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient): Promise<FavoriteCommentTransaction>;

    /**
     * お気に入りコメントを論理削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    softDelete(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        tx: Prisma.TransactionClient): Promise<FavoriteCommentTransaction>;
}

