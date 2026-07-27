import { FavoriteVideoTransaction } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../../internaldata/foldermaster/model/FolderIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetFavoriteVideoFolderSelectEntity } from "../../entity/GetFavoriteVideoFolderSelectEntity";
import { FavoriteVideoFolderType } from "../../model/FavoriteVideoFolderType";
import { FavoriteVideoListCountType } from "../../model/FavoriteVideoListCountType";
import { FolderListModel } from "../../model/FolderListModel";
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
                    (
                        (
                            ${mode} = '1' AND
                            (
                                (
                                    a.folder_master_id = $2 AND
                                    NOT EXISTS(
                                        SELECT
                                            1
                                        FROM
                                            folder_tree tmp_ft
                                        INNER JOIN
                                            favorite_video_folder_transaction tmp_fvft
                                        ON
                                            tmp_ft.id = tmp_fvft.folder_master_id AND
                                            tmp_ft.id <> $2
                                        WHERE
                                            tmp_fvft.video_id = a.video_id
                                    )   
                                )
                                    OR
                                (
                                    a.folder_master_id = $2 AND
                                    b.is_visible_after_folder_add = '1'
                                )
                            )
                        )
                            OR
                        (
                            ${mode} = '2' AND 
                            a.folder_master_id = $2
                        )
                    )
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
     * 最新動画1件ではなく、フォルダに紐づく動画を全件返す。
     * （最新動画がYouTube側で削除/非公開の場合に備え、サムネ取得を次点の動画にフォールバックできるようにするため）
     * @param userIdModel
     * @param folderIdModel
     * @param folderListModel
     */
    async selectFolderList(userIdModel: FrontUserIdModel, folderIdModel: FolderIdModel, folderListModel: FolderListModel): Promise<FavoriteVideoFolderType[]> {

        const userId = userIdModel.frontUserId;
        const folderId = folderIdModel.id;
        const folderList = folderListModel.value;

        const params = [];
        params.push(userId);
        params.push(folderId);
        let paramIndex = 3;

        let sql = `
                SELECT
                    a.user_id as "userId",
                    a.id as "folderId",
                    a.name as "name",
                    a.folder_color as "folderColor",
                    a.create_date as "createDate",
                    a.update_date as "updateDate",
                    b.video_id as "videoId"
                FROM
                    "folder_master" a
                LEFT JOIN
                    "favorite_video_folder_transaction" b
                ON
                    b.folder_master_id = a.id
                WHERE
                    a.user_id = $1 AND
                    a.parent_id = $2
        `;

        // フォルダID
        if (folderList && folderList.length > 0) {
            sql += ` AND a.id = ANY($${paramIndex})`;
            paramIndex++;
            params.push(folderList);
        }

        // b.update_date DESC: フォルダ内の動画を新しい順に並べる（getVideoInfoRecursiveがこの順でフォールバックするため）
        sql += ` ORDER BY a.update_date DESC, b.update_date DESC`;

        const result = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoFolderType[]>(sql, ...params);

        return result;
    };

}