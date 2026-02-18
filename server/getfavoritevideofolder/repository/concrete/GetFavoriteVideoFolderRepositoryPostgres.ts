import { FavoriteVideoTransaction } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../../internaldata/foldermaster/model/FolderIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetFavoriteVideoFolderSelectEntity } from "../../entity/GetFavoriteVideoFolderSelectEntity";
import { FavoriteVideoFolderType } from "../../model/FavoriteVideoFolderType";
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
            WITH RECURSIVE folder_tree AS (
                SELECT 
                    id
                FROM 
                    folder_master
                WHERE 
                    user_id = $1 AND
                    id = $2

                UNION ALL

                SELECT 
                    f.id
                FROM 
                    folder_master f
                INNER JOIN 
                    folder_tree ft
                ON 
                    f.user_id = $1 AND
                    f.parent_id = ft.id
            )
                    
              SELECT
                b.user_id as "userId",
                a.video_id as "videoId" 
    `;

    constructor() {
    }

    private getQuery(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity): queryType {

        const frontUserId = getFavoriteVideoFolderSelectEntity.frontUserId;
        const folderId = getFavoriteVideoFolderSelectEntity.folderId;
        const viewStatus = getFavoriteVideoFolderSelectEntity.viewStatus;
        const videoCategory = getFavoriteVideoFolderSelectEntity.videoCategoryId;
        const videoTag = getFavoriteVideoFolderSelectEntity.tagName;
        const favoriteLevel = getFavoriteVideoFolderSelectEntity.favoriteLevel;
        const mode = getFavoriteVideoFolderSelectEntity.mode;

        const params = [];
        params.push(frontUserId);
        params.push(folderId);
        let paramIndex = 3;

        let sql = `
            FROM 
                favorite_video_folder_transaction a
            INNER JOIN 
                favorite_video_transaction b
            ON 
                b.user_id = $1 
                AND a.video_id = b.video_id
          `;

        // 視聴状況
        if (viewStatus && viewStatus.length > 0) {
            sql += ` AND b.view_status = ANY($${paramIndex})`;
            paramIndex++;
            params.push(viewStatus);
        }

        // カテゴリ
        if (videoCategory && videoCategory.length > 0) {
            sql += ` AND EXISTS(
                SELECT 
                    1
                FROM
                    favorite_video_category_transaction c
                WHERE 
                    c.user_id = $1 AND 
                    c.video_id = a.video_id AND 
                    c.category_id = ANY($${paramIndex})
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
                    favorite_video_tag_transaction d
                WHERE 
                    d.user_id = $1 AND 
                    d.video_id = a.video_id AND 
                    d.tag_id in (
                        SELECT 
                            tag_id
                        FROM 
                            tag_master e
                        WHERE 
                            e.tag_name = ANY($${paramIndex}) AND
                            e.user_id = $1
                )
            )`;
            paramIndex++;
            params.push(videoTag);
        }

        // お気に入り度
        if (favoriteLevel && favoriteLevel.length > 0) {
            sql += ` AND b.favorite_level = ANY($${paramIndex})`;
            paramIndex++;
            params.push(favoriteLevel);
        }

        sql += ` WHERE
                    b.delete_flg = '0' AND
                    a.folder_master_id IN (SELECT id FROM folder_tree)
        `;

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

    /**
     * フォルダリスト取得
     * @param insertFolderEntity 
     * @param tx 
     * @returns 
     */
    async selectFolderList(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel): Promise<FavoriteVideoFolderType[]> {

        const userId = userIdModel.frontUserId;
        const folderId = folderIdModel.id;

        const params = [];
        params.push(userId);
        params.push(folderId);

        let sql = `
                SELECT
                    a.user_id as "userId",
                    a.id as "folderId",
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
                                row_number() OVER(partition by d.user_id,b.folder_master_id ORDER BY c.update_date DESC) as row_number
                            FROM
                                favorite_video_folder_transaction b
                            INNER JOIN
                                folder_master d
                            ON
                                b.folder_master_id = d.id
                            INNER JOIN
                                favorite_video_transaction c
                            ON
                                b.video_id = c.video_id
                                AND d.user_id = c.user_id
                            WHERE
                                d.user_id = a.user_id
                                AND b.folder_master_id = a.id
                        ) d
                        WHERE
                            d.row_number = 1
                    ) as "latestVideoId"
                FROM 
                    "folder_master" a
                WHERE 
                    a.user_id = $1 AND
                    a.parent_id = $2
        `;

        sql += ` ORDER BY a.update_date DESC`;

        const result = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoFolderType[]>(sql, ...params);

        return result;
    };

}