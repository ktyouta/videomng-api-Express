import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { SelectFolderListEntity } from "../../entity/SelectFolderListEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFolderListRepositoryInterface {

    /**
     * フォルダ取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectFolderList(entity: SelectFolderListEntity): Promise<FolderMaster[]>;
}