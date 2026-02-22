import { Prisma } from "@prisma/client";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFavoriteVideoFolderInterface {

    /**
     * お気に入り動画フォルダから削除
     */
    delete(insertFolderEntity: DeleteFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<void>;
}