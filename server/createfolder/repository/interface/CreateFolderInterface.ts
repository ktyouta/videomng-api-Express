import { FolderMaster, Prisma } from "@prisma/client";
import { InsertFolderEntity } from "../../entity/InsertFolderEntity";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFolderRepositoryInterface {

    /**
     * フォルダー取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectFolder(updateFavoriteVideoTagSelectEntity: SelectFolderEntity): Promise<FolderMaster[]>;

    /**
     * フォルダを作成
     */
    insert(insertFolderEntity: InsertFolderEntity, tx: Prisma.TransactionClient): Promise<FolderMaster>;
}