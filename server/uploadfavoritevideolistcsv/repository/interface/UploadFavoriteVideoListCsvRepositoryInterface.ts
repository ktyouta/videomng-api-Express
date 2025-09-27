import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { RegisteredVideoListEntity } from "../../entity/RegisteredVideoListEntity";
import { UpdateVideoListEntity } from "../../entity/UpdateVideoListEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UploadFavoriteVideoListCsvRepositoryInterface {

    /**
     * 削除フラグを元に戻す
     * @param updateVideoListEntity 
     * @param tx 
     */
    updateDeleteFlg(updateVideoListEntity: UpdateVideoListEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * お気に入りに登録する
     * @param registeredVideoListEntity 
     * @param tx 
     */
    register(registeredVideoListEntity: RegisteredVideoListEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}