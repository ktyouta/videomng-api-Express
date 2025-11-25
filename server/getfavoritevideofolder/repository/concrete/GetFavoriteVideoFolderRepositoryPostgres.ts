import { FavoriteVideoTransaction, FolderMaster, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoFolderSelectEntity } from "../../entity/GetFavoriteVideoFolderSelectEntity";
import { GetFavoriteVideoFolderRepositoryInterface } from "../interface/GetFavoriteVideoFolderRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FavoriteVideoListCountType } from "../../model/FavoriteVideoListCountType";

type queryType = {
    query: string,
    params: unknown[]
}

/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoFolderRepositoryPostgres implements GetFavoriteVideoFolderRepositoryInterface {

    private static readonly SELECT_LIST = `
              SELECT
                user_id as "userId",
                video_id as "videoId" 
    `;

    constructor() {
    }

    private getQuery(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity): queryType {

        const frontUserId = getFavoriteVideoFolderSelectEntity.frontUserId;
        const folderId = getFavoriteVideoFolderSelectEntity.folderId;

        let sql = `
            FROM favorite_video_folder_transaction a
            INNER JOIN favorite_video_transaction b
            ON a.user_id = $1 
            AND folder_id = $2
            AND a.user_id = b.user_id
            AND a.video_id = b.video_id
            AND b.delete_flg = '0'
          `;

        const params = [];
        params.push(frontUserId);
        params.push(folderId);

        return {
            query: sql,
            params
        }
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectFavoriteVideoList(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity,
        defaultListLimit: number
    ): Promise<FavoriteVideoTransaction[]> {

        const page = getFavoriteVideoFolderSelectEntity.page;

        let { query, params } = this.getQuery(getFavoriteVideoFolderSelectEntity);

        let sql = GetFavoriteVideoFolderRepositoryPostgres.SELECT_LIST;

        sql += query;
        sql += ` OFFSET ${(page - 1) * defaultListLimit} ROWS`;
        sql += ` FETCH NEXT ${defaultListLimit} ROWS ONLY`;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoTransaction[]>(sql, ...params);

        return favoriteVideoList;
    }

    /**
     * お気に入り動画件数取得
     * @returns 
     */
    async selectFavoriteVideoListCount(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity): Promise<FavoriteVideoListCountType[]> {

        let { query, params } = this.getQuery(getFavoriteVideoFolderSelectEntity);

        let sql = GetFavoriteVideoFolderRepositoryPostgres.SELECT_LIST;

        sql += query;

        const countResult = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoListCountType[]>(sql, ...params);

        return countResult;
    }
}