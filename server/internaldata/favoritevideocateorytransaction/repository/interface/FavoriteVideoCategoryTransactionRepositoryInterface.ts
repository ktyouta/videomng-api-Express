import { FavoriteVideoCategoryTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoCategoryTransactionInsertEntity } from "../../entity/FavoriteVideoCategoryTransactionInsertEntity";
import { FavoriteVideoCategoryTransactionUpdateEntity } from "../../entity/FavoriteVideoCategoryTransactionUpdateEntity";


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
}