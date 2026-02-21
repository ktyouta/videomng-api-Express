import { FolderMaster, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../../internaldata/foldermaster/model/FolderIdModel";
import { DeleteFavoriteVideoEntity } from "../../entity/DeleteFavoriteVideoEntity";
import { DeleteFolderEntity } from "../../entity/DeleteFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFolderRepositoryInterface {

    /**
     * フォルダ削除
     */
    deleteFolder(entity: DeleteFolderEntity, tx: Prisma.TransactionClient): Promise<FolderMaster>;

    /**
     * お気に入り動画フォルダ削除
     */
    deleteFavoriteVideoFolder(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画削除
     */
    deleteFavoriteVideo(entity: DeleteFavoriteVideoEntity, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画メモ削除
     */
    deleteFavoriteVideoMemo(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入りコメント削除
     */
    deleteFavoriteComment(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * ブロックコメント削除
     */
    deleteBlockComment(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * お気に入り動画タグ削除
     */
    deleteFavoriteVideoTag(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * タグマスタ削除
     */
    deleteTagMaster(userIdModel: FrontUserIdModel, tx: Prisma.TransactionClient): Promise<void>;
}