import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { SelectShareVideoEntity } from "../../entity/SelectShareVideoEntity";
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
    async selectFavoriteVideoList(entity: SelectShareVideoEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = entity.frontUserId;
        const folderId = entity.folderId;

        let sql = `
            SELECT
                a.video_id as "videoId",
                a.folder_id as "folderId"
            FROM 
                favorite_video_folder_transaction a
            INNER JOIN 
                favorite_video_transaction b
            ON 
                a.user_id = b.user_id
                AND a.video_id = b.video_id
                AND b.delete_flg = '0'
            WHERE
                a.user_id = $1 
                AND a.folder_id = $2
                AND EXISTS (
                    SELECT 
                        1
                    FROM 
                        favorite_video_folder_transaction c
                    WHERE
                        c.user_id = a.user_id
                        AND c.video_id = a.video_id
                        AND c.folder_id <> $2
                );
          `;

        const params = [];
        params.push(frontUserId);
        params.push(folderId);

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoTransaction[]>(sql, ...params);

        return favoriteVideoList;
    }
}