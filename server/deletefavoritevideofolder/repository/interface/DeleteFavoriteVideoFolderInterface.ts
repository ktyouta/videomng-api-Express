import { FavoriteVideoFolderTransaction, FavoriteVideoTagTransaction, FavoriteVideoTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFavoriteVideoFolderInterface {

    /**
     * お気に入り動画フォルダから削除
     */
    delete(insertFolderEntity: DeleteFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}