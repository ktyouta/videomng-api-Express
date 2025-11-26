import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFolderRepositoryInterface {

    /**
     * フォルダ取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectFolder(entity: SelectFolderEntity): Promise<FolderMaster | null>;
}