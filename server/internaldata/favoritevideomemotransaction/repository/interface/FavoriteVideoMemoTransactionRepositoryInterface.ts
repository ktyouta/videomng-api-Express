import { FavoriteVideoMemoTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../entity/FavoriteVideoMemoTransactionInsertEntity";
import { FavoriteVideoMemoTransactionUpdateEntity } from "../../entity/FavoriteVideoMemoTransactionUpdateEntity";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoMemoTransactionSoftDeleteEntity } from "../../entity/FavoriteVideoMemoTransactionSoftDeleteEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoMemoTransactionRepositoryInterface {

    /**
     * お気に入り動画メモ情報を作成
     */
    insert(favoriteVideoMemoTransactionInsertEntity: FavoriteVideoMemoTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoMemoTransaction>;

    /**
     * お気に入り動画メモ情報を更新
     */
    update(favoriteVideoMemoTransactionUpdateEntity: FavoriteVideoMemoTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoMemoTransaction>;

    /**
     * お気に入り動画メモ情報を削除
     * @param frontUserIdModel 
     * @param videoIdModel 
     */
    delete(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画メモ情報を復元
     * @param userIdModel 
     * @param videoIdModel 
     * @param tx 
     */
    recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * 対象ユーザーのお気に入り動画メモ情報を論理削除
     */
    softDeleteUserMemo(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * お気に入り動画メモ情報を論理削除
     */
    softDelete(favoriteVideoMemoTransactionSoftDeleteEntity: FavoriteVideoMemoTransactionSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoMemoTransaction>;
}

