import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SelectShareVideoEntity } from "../../entity/SelectShareVideoEntity";
import { TargetVideoFolderType } from "../../type/TargetVideoFolderType";
import { FolderShareVideosRepositoryInterface } from "../interface/FolderShareVideosRepositoryInterface";


/**
 * 永続ロジック用クラス
 */
export class FolderShareVideosRepositoryPostgres implements FolderShareVideosRepositoryInterface {

    constructor() {
    }

    /**
     * 別フォルダ内の動画取得
     * @returns 
     */
    async selectFavoriteVideoList(entity: SelectShareVideoEntity): Promise<TargetVideoFolderType[]> {

        const frontUserId = entity.frontUserId;
        const folderId = entity.folderId;

        let sql = `
            WITH RECURSIVE target_tree AS (
                SELECT 
                    id, 
                    parent_id
                FROM 
                    folder_master
                WHERE 
                    user_id = $1 AND
                    id = $2

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
                    user_id = $1 AND
                    id = $2

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
            all_targets_folder_id AS (
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
            ),
            target_videos AS (
                SELECT DISTINCT 
                    video_id
                FROM 
                    favorite_video_folder_transaction
                WHERE 
                    folder_master_id IN (
                        SELECT 
                            id 
                        FROM 
                            target_tree
                    )
            )

            SELECT
                fvft.video_id as "videoId",
                fm.name as "folderName"
            FROM 
                favorite_video_folder_transaction fvft
            INNER JOIN
                folder_master fm
            ON
                fm.id = fvft.folder_master_id
            INNER JOIN 
                favorite_video_transaction fvt
            ON
                fvt.user_id = fm.user_id
                AND fvt.video_id = fvft.video_id
                AND fvt.delete_flg = '0'
            WHERE
                fm.user_id = $1 
                AND fvft.folder_master_id NOT IN(
                    SELECT
                        id
                    FROM
                        all_targets_folder_id
                )
                AND fvft.video_id IN(
                    SELECT
                        video_id
                    FROM
                        target_videos
                )
          `;

        const params = [];
        params.push(frontUserId);
        params.push(folderId);

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<TargetVideoFolderType[]>(sql, ...params);

        return favoriteVideoList;
    }
}