import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { RegisteredVideoListEntity } from "../../entity/RegisteredVideoListEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UploadFavoriteVideoListCsvRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoInsertEntity 
     */
    select(registeredVideoListEntity: RegisteredVideoListEntity, tx: Prisma.TransactionClient): Promise<FavoriteVideoTransaction[]>;
}