import { FavoriteVideoCategoryTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoCategoryTransactionInsertEntity } from "../../entity/FavoriteVideoCategoryTransactionInsertEntity";
import { FavoriteVideoCategoryTransactionUpdateEntity } from "../../entity/FavoriteVideoCategoryTransactionUpdateEntity";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoCategoryTransactionSoftDeleteEntity } from "../../entity/FavoriteVideoCategoryTransactionSoftDeleteEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoCategoryTransactionRepositoryInterface {

    /**
     * お気に入り動画カテゴリを作成
     */
    insert(favoriteVideoCategoryTransactionInsertEntity: FavoriteVideoCategoryTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoCategoryTransaction>;

    /**
     * お気に入り動画カテゴリを更新
     */
    update(favoriteVideoCategoryTransactionUpdateEntity: FavoriteVideoCategoryTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoCategoryTransaction>;

    /**
     * お気に入り動画カテゴリを削除
     * @param frontUserIdModel 
     * @param videoIdModel 
     */
    delete(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画カテゴリを復元
     * @param userIdModel 
     * @param videoIdModel 
     * @param tx 
     */
    recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * 対象ユーザーのお気に入り動画カテゴリを論理削除
     */
    softDeleteUserCategory(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * お気に入り動画カテゴリを論理削除
     */
    softDelete(favoriteVideoCategoryTransactionSoftDeleteEntity: FavoriteVideoCategoryTransactionSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoCategoryTransaction>;
}

