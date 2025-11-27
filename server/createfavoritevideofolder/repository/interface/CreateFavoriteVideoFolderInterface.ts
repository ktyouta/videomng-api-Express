import { FavoriteVideoFolderTransaction, FavoriteVideoTagTransaction, FavoriteVideoTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { InsertFavoriteVideoFolderEntity } from "../../entity/InsertFavoriteVideoFolderEntity";
import { SelectFavoriteVideoEntity } from "../../entity/SelectFavoriteVideoEntity";
import { SelectFavoriteVideoFolderEntity } from "../../entity/SelectFavoriteVideoFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFavoriteVideoFolderInterface {

    /**
     * フォルダー取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectFolder(updateFavoriteVideoTagSelectEntity: SelectFolderEntity): Promise<FolderMaster | null>;

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideo(selectFavoriteVideoEntity: SelectFavoriteVideoEntity): Promise<FavoriteVideoTransaction | null>;

    /**
     * お気に入り動画フォルダ登録
     */
    insert(insertFolderEntity: InsertFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<FavoriteVideoFolderTransaction>;

    /**
     * フォルダ内のお気に入り動画取得
     * @param selectFavoriteVideoFolderEntity 
     */
    selectFavoriteVideoFolder(selectFavoriteVideoFolderEntity: SelectFavoriteVideoFolderEntity): Promise<FavoriteVideoFolderTransaction | null>;
}