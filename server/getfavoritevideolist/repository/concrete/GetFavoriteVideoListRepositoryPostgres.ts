import { FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoListSelectEntity } from "../../entity/GetFavoriteVideoListSelectEntity";
import { GetFavoriteVideoListRepositoryInterface } from "../interface/GetFavoriteVideoListRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoListRepositoryPostgres implements GetFavoriteVideoListRepositoryInterface {

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
            case `0`:
                sql += ` ORDER BY a.update_date desc`;
                break;
            case `1`:
                sql += ` ORDER BY a.update_date`;
                break;
            case `2`:
                sql += ` ORDER BY a.create_date desc`;
                break;
            case `3`:
                sql += ` ORDER BY a.create_date`;
                break;
            default:
                sql += ` ORDER BY a.update_date desc`;
                break;
        }

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoTransaction[]>(sql, ...params);

        return favoriteVideoList;
    }

}