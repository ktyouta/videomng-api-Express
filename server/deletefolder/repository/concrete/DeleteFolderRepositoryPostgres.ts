import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFolderEntity } from "../../entity/DeleteFolderEntity";
import { DeleteFolderRepositoryInterface } from "../interface/DeleteFolderRepositoryInterface";
import { DeleteFavoriteVideoEntity } from "../../entity/DeleteFavoriteVideoEntity";


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
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        const result = tx.folderMaster.deleteMany({
            where: {
                userId,
                folderId
            }
        });

        return result;
    };

    /**
     * お気に入り動画フォルダを削除
     */
    async deleteVideoFolder(entity: DeleteFavoriteVideoFolderEntity,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        const result = tx.favoriteVideoFolderTransaction.deleteMany({
            where: {
                userId,
                folderId
            }
        });

        return result;
    };

    /**
     * お気に入り動画フォルダを削除
     */
    async deleteFavoriteVideo(entity: DeleteFavoriteVideoEntity,
        tx: Prisma.TransactionClient): Promise<void> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        await tx.$queryRaw`
            UPDATE 
                favorite_video_transaction a
            SET
                delete_flg = '1'
            WHERE 
                a.user_id = ${userId} AND
                EXISTS(
                    SELECT 
                        1
                    FROM
                        favorite_video_folder_transaction b
                    WHERE
                        b.user_id = ${userId} AND
                        b.folder_id = ${folderId} AND
                        b.video_id = a.video_id
            )
        `;
    };
}