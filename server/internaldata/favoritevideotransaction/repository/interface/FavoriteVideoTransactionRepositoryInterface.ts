import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoTransactionInsertEntity } from "../../entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionUpdateEntity } from "../../entity/FavoriteVideoTransactionUpdateEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoTransactionRepositoryInterface {

    /**
     * お気に入り動画情報を作成
     */
    insert(favoriteVideoTransactionInsertEntity: FavoriteVideoTransactionInsertEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoTransaction>;

    /**
     * お気に入り動画情報を更新
     */
    update(favoriteVideoTransactionUpdateEntity: FavoriteVideoTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ): Promise<FavoriteVideoTransaction>;

    /**
     * 削除動画の復元
     */
    recovery(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoTransaction>;

    /**
     * お気に入り動画を削除
     * @param userId 
     * @param videoIdModel 
     * @param tx 
     */
    delete(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoTransaction>;
}

