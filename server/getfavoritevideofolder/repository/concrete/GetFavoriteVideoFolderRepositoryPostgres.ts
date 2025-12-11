import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteVideoFolderSelectEntity } from "../../entity/GetFavoriteVideoFolderSelectEntity";
import { FavoriteVideoListCountType } from "../../model/FavoriteVideoListCountType";
import { GetFavoriteVideoFolderRepositoryInterface } from "../interface/GetFavoriteVideoFolderRepositoryInterface";

type queryType = {
    query: string,
    params: unknown[]
}

/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoFolderRepositoryPostgres implements GetFavoriteVideoFolderRepositoryInterface {

    // ソートクエリ(メモ登録数)
    private static readonly SORT_MEMO = `(
                    SELECT
                        count(*)
                    FROM
                        favorite_video_memo_transaction d
                    WHERE
                        d.user_id = $1 AND
                        d.video_id = a.video_id AND
                        d.delete_flg = '0'
                )`;

    // ソートクエリ(お気に入りコメント登録数)
    private static readonly SORT_FAVORITE_COMMENT = `(
                    SELECT
                        count(*)
                    FROM
                        favorite_video_memo_transaction d
                    WHERE
                        d.user_id = $1 AND
                        d.video_id = a.video_id AND
                        d.delete_flg = '0'
                )`;

    private static readonly SELECT_LIST = `
              SELECT
                a.user_id as "userId",
                a.video_id as "videoId" 
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
        const sortId = getFavoriteVideoFolderSelectEntity.sortId;

        let { query, params } = this.getQuery(getFavoriteVideoFolderSelectEntity);

        let sql = GetFavoriteVideoFolderRepositoryPostgres.SELECT_LIST;

        sql += query;

        // ソート
        switch (sortId) {
            // 更新日-降順
            case `0`:
                sql += ` ORDER BY b.update_date desc`;
                break;
            // 更新日-昇順
            case `1`:
                sql += ` ORDER BY b.update_date`;
                break;
            // 登録日-降順
            case `2`:
                sql += ` ORDER BY b.create_date desc, b.update_date desc`;
                break;
            // 登録日-昇順
            case `3`:
                sql += ` ORDER BY b.create_date, b.update_date desc`;
                break;
            // メモ登録数-降順
            case `4`:
                sql += ` ORDER BY ${GetFavoriteVideoFolderRepositoryPostgres.SORT_MEMO} desc, b.update_date desc`;
                break;
            // メモ登録数-昇順
            case `5`:
                sql += ` ORDER BY ${GetFavoriteVideoFolderRepositoryPostgres.SORT_MEMO}, b.update_date desc`;
                break;
            // お気に入りコメント登録数-降順
            case `6`:
                sql += ` ORDER BY ${GetFavoriteVideoFolderRepositoryPostgres.SORT_FAVORITE_COMMENT} desc, b.update_date desc`;
                break;
            // お気に入りコメント登録数-降順
            case `7`:
                sql += ` ORDER BY ${GetFavoriteVideoFolderRepositoryPostgres.SORT_FAVORITE_COMMENT}, b.update_date desc`;
                break;
            // お気に入り度-降順
            case `8`:
                sql += ` ORDER BY b.favorite_level desc, b.update_date desc`;
                break;
            // お気に入り度-昇順
            case `9`:
                sql += ` ORDER BY b.favorite_level, b.update_date desc`;
                break;
            // 更新日-降順
            default:
                sql += ` ORDER BY b.update_date desc`;
                break;
        }

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