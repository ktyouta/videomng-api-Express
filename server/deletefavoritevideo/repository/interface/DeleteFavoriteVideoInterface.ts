import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFavoriteVideoInterface {

    /**
     * お気に入り動画フォルダから削除
     */
    deleteFavoriteVideoFolder(insertEntity: DeleteFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * タグマスタ削除
     * @param updateFavoriteVideoTagTagMasterSelectEntity 
     */
    deleteTagMaster(frontUserIdModel: FrontUserIdModel, tx: Prisma.TransactionClient): Promise<void>;
}