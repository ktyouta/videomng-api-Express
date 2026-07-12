import { FavoriteVideoFolderTransaction, FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { InsertFavoriteVideoFolderEntity } from "../../entity/InsertFavoriteVideoFolderEntity";
import { InsertFavoriteVideoTagEntity } from "../../entity/InsertFavoriteVideoTagEntity";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { SelectTagMasterEntity } from "../../entity/SelectTagMasterEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFavoriteVideoRepositoryInterface {

    /**
     * お気に入り動画タグを登録
     * @param tagList 
     * @param tx 
     */
    insertVideoTag(entity: InsertFavoriteVideoTagEntity, tx: Prisma.TransactionClient): Promise<FavoriteVideoTagTransaction>;

    /**
     * フォルダー取得
     * @param favoriteVideoTagInsertEntity
     */
    selectFolder(updateFavoriteVideoTagSelectEntity: SelectFolderEntity): Promise<FolderMaster | null>;

    /**
     * タグマスタ取得
     * @param selectTagMasterEntity
     */
    selectTagMaster(selectTagMasterEntity: SelectTagMasterEntity): Promise<TagMaster[]>;

    /**
     * お気に入り動画フォルダ登録
     */
    insertFavoriteFolder(insertFolderEntity: InsertFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<FavoriteVideoFolderTransaction>;
}