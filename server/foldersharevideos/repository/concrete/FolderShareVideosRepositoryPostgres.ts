import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { SelectShareVideoEntity } from "../../entity/SelectShareVideoEntity";
import { FolderInfoType } from "../../type/FolderInfoType";
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

    /**
     * 対象動画のフォルダ情報を取得
     * @returns 
     */
    async selectFolderList(entity: SelectFolderEntity): Promise<FolderInfoType[]> {

        const frontUserId = entity.frontUserId;
        const videoId = entity.videoId;
        const folderId = entity.folderId;

        let sql = `
            SELECT
                b.name as "folderName"
            FROM 
                favorite_video_folder_transaction a
            INNER JOIN 
                folder_master b
            ON 
                a.user_id = b.user_id
                AND a.folder_id = b.folder_id
            WHERE
                a.user_id = $1
                AND a.video_id = $2
                AND a.folder_id <> $3
          `;

        const params = [];
        params.push(frontUserId);
        params.push(videoId);
        params.push(folderId);

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FolderInfoType[]>(sql, ...params);

        return favoriteVideoList;
    }
}