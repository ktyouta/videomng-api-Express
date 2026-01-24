import { FavoriteVideoTagTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoTagTransactionInsertEntity } from "../../entity/FavoriteVideoTagTransactionInsertEntity";


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
}

