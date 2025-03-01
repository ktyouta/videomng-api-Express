import { FavoriteVideoCommentTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoCommentTransactionInsertEntity } from "../../entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoCommentTransactionUpdateEntity } from "../../entity/FavoriteVideoTransactionUpdateEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoCommentTransactionRepositoryInterface {

    /**
     * お気に入り動画情報を作成
     */
    insert(favoriteVideoCommentTransactionInsertEntity: FavoriteVideoCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoCommentTransaction>;

    /**
     * お気に入り動画情報を更新
     */
    update(favoriteVideoCommentTransactionUpdateEntity: FavoriteVideoCommentTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoCommentTransaction>;

}

