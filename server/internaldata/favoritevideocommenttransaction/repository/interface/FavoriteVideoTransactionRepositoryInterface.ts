import { FavoriteVideoCommentTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoCommentTransactionInsertEntity } from "../../entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoCommentTransactionUpdateEntity } from "../../entity/FavoriteVideoTransactionUpdateEntity";
import { FrontUserIdModel } from "../../../frontuserinfomaster/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../favoritevideotransaction/properties/VideoIdModel";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoCommentTransactionRepositoryInterface {

    /**
     * お気に入り動画コメント情報を作成
     */
    insert(favoriteVideoCommentTransactionInsertEntity: FavoriteVideoCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoCommentTransaction>;

    /**
     * お気に入り動画コメント情報を更新
     */
    update(favoriteVideoCommentTransactionUpdateEntity: FavoriteVideoCommentTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoCommentTransaction>;

    /**
     * お気に入り動画コメント情報を削除
     * @param frontUserIdModel 
     * @param videoIdModel 
     */
    delete(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画コメント情報を復元
     * @param userIdModel 
     * @param videoIdModel 
     * @param tx 
     */
    recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}

