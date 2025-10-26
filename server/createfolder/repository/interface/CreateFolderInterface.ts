import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { FolderNextSeqType } from "../../type/FolderNextSeqType";
import { InsertFolderEntity } from "../../entity/InsertFolderEntity";


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
     * フォルダーマスタのシーケンス番号取得
     * @param frontUserIdModel 
     */
    getFolderNextSeq(frontUserIdModel: FrontUserIdModel): Promise<FolderNextSeqType[]>;

    /**
     * フォルダを作成
     */
    insert(insertFolderEntity: InsertFolderEntity, tx: Prisma.TransactionClient): Promise<FolderMaster>;
}