import { Prisma } from "@prisma/client";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFavoriteVideoFolderInterface } from "../interface/DeleteFavoriteVideoFolderInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class DeleteFavoriteVideoFolderRepositoryPostgres implements DeleteFavoriteVideoFolderInterface {

    constructor() {
    }

    /**
     * お気に入り動画フォルダから削除
     */
    async delete(insertFolderEntity: DeleteFavoriteVideoFolderEntity,
        tx: Prisma.TransactionClient) {

        const userId = insertFolderEntity.frontUserId;
        const folderId = insertFolderEntity.folderId;
        const videoId = insertFolderEntity.videoId;

        await tx.$queryRaw`
            WITH RECURSIVE target_tree AS (
                SELECT 
                    id, 
                    parent_id
                FROM 
                    folder_master
                WHERE 
                    user_id = ${userId} AND
                    id = ${folderId}

                UNION ALL

                SELECT 
                    f.id,
                    f.parent_id
                FROM 
                    folder_master f
                INNER JOIN 
                    target_tree t 
                ON 
                    f.parent_id = t.id
            ),
            ancestors AS (
                SELECT 
                    id, 
                    parent_id
                FROM 
                    folder_master
                WHERE 
                    user_id = ${userId} AND
                    id = ${folderId}

                UNION ALL

                SELECT 
                    f.id, 
                    f.parent_id
                FROM 
                    folder_master f
                INNER JOIN 
                    ancestors a 
                ON 
                    a.parent_id = f.id
            ),
            all_targets AS (
                SELECT DISTINCT 
                    id 
                FROM (
                    SELECT 
                        id 
                    FROM target_tree
                    UNION ALL
                    SELECT 
                        id 
                    FROM 
                        ancestors
                ) t
            )

            DELETE FROM 
                favorite_video_folder_transaction fvft
            USING
                folder_master fm
            WHERE 
                fvft.folder_master_id = fm.id AND
                fm.user_id = ${userId} AND
                fvft.folder_master_id IN (
                    SELECT 
                        id 
                    FROM 
                        all_targets
                ) AND
                fvft.video_id = ${videoId}
        `;
    };
}