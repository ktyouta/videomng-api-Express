import { FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoListSelectEntity } from "../../entity/GetFavoriteVideoListSelectEntity";
import { GetFavoriteVideoListRepositoryInterface } from "../interface/GetFavoriteVideoListRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";



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



    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectFavoriteVideoList(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getFavoriteVideoListSelectEntity.frontUserId;
        const viewStatus = getFavoriteVideoListSelectEntity.viewStatus;
        const videoCategory = getFavoriteVideoListSelectEntity.videoCategoryId;
        const videoTag = getFavoriteVideoListSelectEntity.tagName;
        const sortId = getFavoriteVideoListSelectEntity.sortId;

        let sql = `
            SELECT
              user_id as "userId",
              video_id as "videoId"
            FROM favorite_video_transaction a
            WHERE user_id = $1
              AND delete_flg = '0'
          `;

        const params = [];
        params.push(frontUserId);
        let paramIndex = 2;

        // 視聴状況
        if (viewStatus) {
            sql += ` AND view_status = $${paramIndex}`;
            paramIndex++;
            params.push(viewStatus);
        }

        // カテゴリ
        if (videoCategory) {
            sql += ` AND EXISTS(
                SELECT 1
                FROM favorite_video_category_transaction b
                WHERE b.user_id = $1
                AND b.video_id = a.video_id
                AND b.category_id = $${paramIndex}
            )`;
            paramIndex++;
            params.push(videoCategory);
        }

        // タグ
        if (videoTag) {
            sql += ` AND EXISTS(
                SELECT 1
                FROM favorite_video_tag_transaction c
                WHERE c.user_id = $1
                AND c.video_id = a.video_id
                AND c.tag_id = (
                    SELECT max(tag_id)
                    FROM tag_master d
                    WHERE d.tag_name = $${paramIndex}
                )
            )`;
            paramIndex++;
            params.push(videoTag);
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

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoTransaction[]>(sql, ...params);

        return favoriteVideoList;
    }

}