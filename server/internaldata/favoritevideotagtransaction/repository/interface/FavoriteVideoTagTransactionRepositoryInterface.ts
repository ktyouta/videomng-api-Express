import { FavoriteVideoTagTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoTagTransactionInsertEntity } from "../../entity/FavoriteVideoTagTransactionInsertEntity";
import { FavoriteVideoTagTransactionUpdateEntity } from "../../entity/FavoriteVideoTagTransactionUpdateEntity";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoTagTransactionSoftDeleteEntity } from "../../entity/FavoriteVideoTagTransactionSoftDeleteEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoTagTransactionRepositoryInterface {

    /**
     * お気に入り動画タグを作成
     */
    insert(favoriteVideoTagTransactionInsertEntity: FavoriteVideoTagTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoTagTransaction>;

    /**
     * お気に入り動画タグを削除
     * @param frontUserIdModel 
     * @param videoIdModel 
     */
    delete(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画タグを復元
     * @param userIdModel 
     * @param videoIdModel 
     * @param tx 
     */
    recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * 対象ユーザーのお気に入り動画タグを論理削除
     */
    softDeleteUserTag(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * お気に入り動画タグを論理削除
     */
    softDelete(favoriteVideoTagTransactionSoftDeleteEntity: FavoriteVideoTagTransactionSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoTagTransaction>;
}

