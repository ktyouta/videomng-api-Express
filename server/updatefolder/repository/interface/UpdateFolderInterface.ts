import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectDuplicationFolderEntity } from "../../entity/SelectDuplicationFolderEntity";
import { FolderNextSeqType } from "../../type/FolderNextSeqType";
import { UpdateFolderEntity } from "../../entity/UpdateFolderEntity";
import { SelectExistsFolderEntity } from "../../entity/SelectExistsFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFolderRepositoryInterface {

    /**
     * フォルダー存在チェック
     * @param favoriteVideoTagInsertEntity 
     */
    selectExistsFolder(entity: SelectExistsFolderEntity): Promise<FolderMaster[]>;

    /**
     * フォルダ重複チェック
     * @param favoriteVideoTagInsertEntity 
     */
    selectDuplicationFolder(entity: SelectDuplicationFolderEntity): Promise<FolderMaster[]>;

    /**
     * フォルダ更新
     */
    update(insertFolderEntity: UpdateFolderEntity, tx: Prisma.TransactionClient): Promise<FolderMaster>;
}