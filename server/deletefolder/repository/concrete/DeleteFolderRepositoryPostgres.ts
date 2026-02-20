import { FolderMaster, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../../internaldata/foldermaster/model/FolderIdModel";
import { DeleteFavoriteVideoEntity } from "../../entity/DeleteFavoriteVideoEntity";
import { DeleteFolderEntity } from "../../entity/DeleteFolderEntity";
import { DeleteFolderRepositoryInterface } from "../interface/DeleteFolderRepositoryInterface";


/**
 * json形式の永続ロジック用クラス
 */
export class DeleteFolderRepositoryPostgres implements DeleteFolderRepositoryInterface {

    constructor() {
    }

    /**
     * フォルダを削除
     */
    async deleteFolder(entity: DeleteFolderEntity,
        tx: Prisma.TransactionClient): Promise<FolderMaster> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        const result = tx.folderMaster.delete({
            where: {
                userId,
                id: folderId
            }
        });

        return result;
    };

    /**
     * お気に入り動画を削除
     */
    async deleteFavoriteVideo(entity: DeleteFavoriteVideoEntity,
        tx: Prisma.TransactionClient): Promise<void> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        await tx.$queryRaw`
            DELETE
            FROM
                favorite_video_transaction a
            WHERE 
                a.user_id = ${userId} AND
                EXISTS(
                    SELECT 
                        1
                    FROM
                        favorite_video_folder_transaction b
                    WHERE
                        b.folder_master_id = ${folderId} AND
                        b.video_id = a.video_id
            )
        `;
    };

    /**
     * お気に入り動画メモ削除
     */
    async deleteFavoriteVideoMemo(userIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient): Promise<void> {

        const userId = userIdModel.frontUserId;
        const folderId = folderIdModel.id;

        await tx.$queryRaw`
            DELETE
            FROM
                favorite_video_memo_transaction a
            WHERE 
                a.user_id = ${userId} AND
                a.video_id = 
                (
                    SELECT 
                        b.video_id
                    FROM
                        favorite_video_folder_transaction b
                    WHERE
                        b.folder_master_id = ${folderId} AND
                        b.video_id = a.video_id
                )
        `;
    };

    /**
     * お気に入りコメント削除
     */
    async deleteFavoriteComment(userIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient): Promise<void> {

        const userId = userIdModel.frontUserId;
        const folderId = folderIdModel.id;

        await tx.$queryRaw`
            DELETE
            FROM
                favorite_commnet_transaction a
            WHERE 
                a.user_id = ${userId} AND
                a.video_id = 
                (
                    SELECT 
                        b.video_id
                    FROM
                        favorite_video_folder_transaction b
                    WHERE
                        b.folder_master_id = ${folderId} AND
                        b.video_id = a.video_id
                )
        `;
    };

    /**
     * ブロックコメント削除
     */
    async deleteBlockComment(userIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient): Promise<void> {

        const userId = userIdModel.frontUserId;
        const folderId = folderIdModel.id;

        await tx.$queryRaw`
            DELETE
            FROM
                block_commnet_transaction a
            WHERE 
                a.user_id = ${userId} AND
                a.video_id = 
                (
                    SELECT 
                        b.video_id
                    FROM
                        favorite_video_folder_transaction b
                    WHERE
                        b.folder_master_id = ${folderId} AND
                        b.video_id = a.video_id
                )
        `;
    };

    /**
     * お気に入り動画タグ削除
     */
    async deleteFavoriteVideoTag(userIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient): Promise<void> {

        const userId = userIdModel.frontUserId;
        const folderId = folderIdModel.id;

        await tx.$queryRaw`
            DELETE
            FROM
                favorite_video_tag_transaction a
            WHERE 
                a.user_id = ${userId} AND
                a.video_id = 
                (
                    SELECT 
                        b.video_id
                    FROM
                        favorite_video_folder_transaction b
                    WHERE
                        b.folder_master_id = ${folderId} AND
                        b.video_id = a.video_id
                )
        `;
    };

    /**
     * タグマスタ削除
     * @param createFavoriteVideoMemoSeqSelectEntity 
     * @returns 
     */
    async deleteTagMaster(frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient)
        : Promise<void> {

        const frontUserId = frontUserIdModel.frontUserId;

        await tx.$queryRaw`
            DELETE FROM 
                tag_master a
            WHERE 
                user_id = ${frontUserId} AND
            NOT EXISTS(
                SELECT 
                    1
                FROM
                    favorite_video_tag_transaction b
                WHERE
                    b.user_id = ${frontUserId} AND
                    b.tag_id = a.tag_id
            )
        `;
    }
}