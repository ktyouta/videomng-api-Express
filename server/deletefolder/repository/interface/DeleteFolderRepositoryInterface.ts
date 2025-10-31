import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFolderEntity } from "../../entity/DeleteFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFolderRepositoryInterface {

    /**
     * フォルダ削除
     */
    deleteFolder(entity: DeleteFolderEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;

    /**
     * お気に入り動画フォルダ削除
     */
    deleteVideoFolder(entity: DeleteFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}