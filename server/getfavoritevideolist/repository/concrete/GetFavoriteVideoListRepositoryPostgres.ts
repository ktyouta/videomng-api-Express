import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetFavoriteVideoListSelectEntity } from "../../entity/GetFavoriteVideoListSelectEntity";
import { GetFolderListEntity } from "../../entity/GetFolderListEntity";
import { FavoriteVideoFolderType } from "../../model/FavoriteVideoFolderType";
import { FavoriteVideoListCountType } from "../../model/FavoriteVideoListCountType";
import { GetFavoriteVideoListRepositoryInterface } from "../interface/GetFavoriteVideoListRepositoryInterface";

type queryType = {
    query: string,
    params: unknown[]
}

/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoListRepositoryPostgres implements GetFavoriteVideoListRepositoryInterface {

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
                user_id as "userId",
                video_id as "videoId",
                is_visible_after_folder_add as "isVisibleAfterFolderAdd"
    `;

    constructor() {
    }

    private getQuery(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity): queryType {

        const frontUserId = getFavoriteVideoListSelectEntity.frontUserId;
        const viewStatus = getFavoriteVideoListSelectEntity.viewStatus;
        const videoCategory = getFavoriteVideoListSelectEntity.videoCategoryId;
        const videoTag = getFavoriteVideoListSelectEntity.tagName;
        const sortId = getFavoriteVideoListSelectEntity.sortId;
        const favoriteLevel = getFavoriteVideoListSelectEntity.favoriteLevel;

        let sql = `
            FROM favorite_video_transaction a
            WHERE user_id = $1
              AND delete_flg = '0'
              AND (
                is_visible_after_folder_add = '1' OR 
                NOT EXISTS(
                    SELECT 
                        1
                    FROM
                        favorite_video_folder_transaction b
                    WHERE 
                        b.user_id = $1 AND 
                        b.video_id = a.video_id 
                )
              )
          `;

        const params = [];
        params.push(frontUserId);
        let paramIndex = 2;

        // 視聴状況
        if (viewStatus && viewStatus.length > 0) {
            sql += ` AND view_status = ANY($${paramIndex})`;
            paramIndex++;
            params.push(viewStatus);
        }

        // カテゴリ
        if (videoCategory && videoCategory.length > 0) {
            sql += ` AND EXISTS(
                SELECT 
                    1
                FROM
                    favorite_video_category_transaction b
                WHERE 
                    b.user_id = $1 AND 
                    b.video_id = a.video_id AND 
                    b.category_id = ANY($${paramIndex})
            )`;
            paramIndex++;
            params.push(videoCategory);
        }

        // タグ
        if (videoTag && videoTag.length > 0) {
            sql += ` AND EXISTS(
                SELECT 
                    1
                FROM 
                    favorite_video_tag_transaction c
                WHERE 
                    c.user_id = $1 AND 
                    c.video_id = a.video_id AND 
                    c.tag_id in (
                        SELECT 
                            tag_id
                        FROM 
                            tag_master d
                        WHERE 
                            d.tag_name = ANY($${paramIndex}) AND
                            d.user_id = $1
                )
            )`;
            paramIndex++;
            params.push(videoTag);
        }

        // お気に入り度
        if (favoriteLevel && favoriteLevel.length > 0) {
            sql += ` AND favorite_level = ANY($${paramIndex})`;
            paramIndex++;
            params.push(favoriteLevel);
        }

        // ソート
        switch (sortId) {
            // 更新日-降順
            case `0`:
                sql += ` ORDER BY a.update_date desc`;
                break;
            // 更新日-昇順
            case `1`:
                sql += ` ORDER BY a.update_date`;
                break;
            // 登録日-降順
            case `2`:
                sql += ` ORDER BY a.create_date desc`;
                break;
            // 登録日-昇順
            case `3`:
                sql += ` ORDER BY a.create_date`;
                break;
            // メモ登録数-降順
            case `4`:
                sql += ` ORDER BY ${GetFavoriteVideoListRepositoryPostgres.SORT_MEMO} desc, a.update_date desc`;
                break;
            // メモ登録数-昇順
            case `5`:
                sql += ` ORDER BY ${GetFavoriteVideoListRepositoryPostgres.SORT_MEMO}, a.update_date desc`;
                break;
            // お気に入りコメント登録数-降順
            case `6`:
                sql += ` ORDER BY ${GetFavoriteVideoListRepositoryPostgres.SORT_FAVORITE_COMMENT} desc, a.update_date desc`;
                break;
            // お気に入りコメント登録数-降順
            case `7`:
                sql += ` ORDER BY ${GetFavoriteVideoListRepositoryPostgres.SORT_FAVORITE_COMMENT}, a.update_date desc`;
                break;
            // お気に入り度-降順
            case `8`:
                sql += ` ORDER BY a.favorite_level desc, a.update_date desc`;
                break;
            // お気に入り度-昇順
            case `9`:
                sql += ` ORDER BY a.favorite_level, a.update_date desc`;
                break;
            // 更新日-降順
            default:
                sql += ` ORDER BY a.update_date desc`;
                break;
        }

        return {
            query: sql,
            params
        }
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectFavoriteVideoList(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity,
        defaultListLimit: number
    ): Promise<FavoriteVideoTransaction[]> {

        const page = getFavoriteVideoListSelectEntity.page;

        let { query, params } = this.getQuery(getFavoriteVideoListSelectEntity);

        let sql = GetFavoriteVideoListRepositoryPostgres.SELECT_LIST;

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
    async selectFavoriteVideoListCount(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity): Promise<FavoriteVideoListCountType[]> {

        let { query, params } = this.getQuery(getFavoriteVideoListSelectEntity);

        let sql = GetFavoriteVideoListRepositoryPostgres.SELECT_LIST;

        sql += query;

        const countResult = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoListCountType[]>(sql, ...params);

        return countResult;
    }

    /**
     * フォルダリスト取得
     * @param insertFolderEntity 
     * @param tx 
     * @returns 
     */
    async selectFolderList(getFolderListEntity: GetFolderListEntity): Promise<FavoriteVideoFolderType[]> {

        const userId = getFolderListEntity.frontUserId;
        const folderList = getFolderListEntity.folderList;

        const params = [];
        params.push(userId);
        let paramIndex = 2;

        let sql = `
                SELECT
                    a.user_id as "userId",
                    a.folder_id as "folderId",
                    a.name as "name",
                    a.folder_color as "folderColor",
                    a.create_date as "createDate",
                    a.update_date as "updateDate",
                    (
                        SELECT
                            d.video_id
                        FROM(
                            SELECT
                                c.video_id as video_id,
                                c.update_date as update_date,
                                row_number() OVER(partition by c.user_id,b.folder_id ORDER BY c.update_date DESC) as row_number
                            FROM
                                favorite_video_folder_transaction b
                            INNER JOIN
                                favorite_video_transaction c
                            ON
                                b.video_id = c.video_id
                                AND b.user_id = c.user_id
                            WHERE
                                b.user_id = a.user_id
                                AND b.folder_id = a.folder_id
                        ) d
                        WHERE
                            d.row_number = 1
                    ) as "latestVideoId"
                FROM 
                    "folder_master" a
                WHERE 
                    a.user_id = $1
        `;

        // フォルダID
        if (folderList && folderList.length > 0) {
            sql += ` AND a.folder_id = ANY($${paramIndex})`;
            paramIndex++;
            params.push(folderList);
        }

        sql += ` ORDER BY a.update_date DESC`;

        const result = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoFolderType[]>(sql, ...params);

        return result;
    };
}