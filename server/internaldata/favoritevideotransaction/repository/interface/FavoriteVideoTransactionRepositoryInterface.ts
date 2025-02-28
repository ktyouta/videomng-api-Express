import { FavoriteVideoTransactionUpdateEntity } from "../../entity/FavoriteVideoTransactionUpdateEntity";
import { FavoriteVideoTransactionInsertEntity } from "../../entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../frontuserinfomaster/properties/FrontUserIdModel";
import { VideoIdModel } from "../../properties/VideoIdModel";


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
}

