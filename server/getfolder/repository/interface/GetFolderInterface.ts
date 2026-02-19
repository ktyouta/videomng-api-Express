import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { FolderListType } from "../../types/FolderListType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFolderRepositoryInterface {

    /**
     * フォルダ取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectFolder(entity: SelectFolderEntity): Promise<FolderListType[]>;
}