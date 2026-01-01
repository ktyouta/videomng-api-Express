import { FavoriteVideoMemoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetFavoriteVideoDetialCategorySelectEntity } from "../../entity/GetFavoriteVideoDetialCategorySelectEntity";
import { GetFavoriteVideoDetialMemoSelectEntity } from "../../entity/GetFavoriteVideoDetialMemoSelectEntity";
import { GetFavoriteVideoDetialSelectEntity } from "../../entity/GetFavoriteVideoDetialSelectEntity";
import { FavoriteVideoDetailCategoryType } from "../../type/FavoriteVideoDetailCategoryType";
import { FavoriteVideoDetailType } from "../../type/FavoriteVideoDetailType";
import { GetFavoriteVideoDetialRepositoryInterface } from "../interface/GetFavoriteVideoDetialRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoDetialRepositoryPostgres implements GetFavoriteVideoDetialRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialSelectEntity): Promise<FavoriteVideoDetailType[]> {

        const frontUserId = getFavoriteVideoDetialSelectEntity.frontUserId;
        const videoId = getFavoriteVideoDetialSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoDetailType[]>`
            SELECT 
                a.user_id as "userId",
                a.video_id as "videoId",
                COALESCE(a.summary, '') AS "summary",
                a.view_status as "viewStatus",
                b.label as "viewStatusName",
                a.favorite_level as "favoriteLevel"
            FROM "favorite_video_transaction" a
            LEFT JOIN "view_status_master" b
            ON a.view_status = b.id 
            WHERE a.user_id = ${frontUserId} AND
            a.video_id = ${videoId} AND
            a.delete_flg = '0'
            `;

        return favoriteVideoList;
    }

    /**
     * お気に入り動画コメント取得
     * @returns 
     */
    async selectVideoMemo(getFavoriteVideoDetialMemoSelectEntity: GetFavoriteVideoDetialMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]> {

        const frontUserId = getFavoriteVideoDetialMemoSelectEntity.frontUserId;
        const videoId = getFavoriteVideoDetialMemoSelectEntity.videoId;

        const favoriteVideoMemo = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoMemoTransaction[]>`
            SELECT 
                user_id as "userId",
                video_id as "videoId",
                video_memo_seq as "videoMemoSeq",
                video_memo as "videoMemo",
                create_date as "createDate",
                update_date as "updateDate"
            FROM "favorite_video_memo_transaction" 
            WHERE user_id = ${frontUserId} AND
            video_id = ${videoId} AND
            delete_flg = '0'
            `;

        return favoriteVideoMemo;
    }

    /**
     * お気に入り動画カテゴリ取得
     * @returns 
     */
    async selectVideoCategory(getFavoriteVideoDetialCategorySelectEntity: GetFavoriteVideoDetialCategorySelectEntity): Promise<FavoriteVideoDetailCategoryType[]> {

        const frontUserId = getFavoriteVideoDetialCategorySelectEntity.frontUserId;
        const videoId = getFavoriteVideoDetialCategorySelectEntity.videoId;

        const favoriteVideoCategory = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoDetailCategoryType[]>`
            SELECT 
                user_id as "userId",
                video_id as "videoId",
                category_id as "categoryId",
                create_date as "createDate",
                update_date as "updateDate"
            FROM "favorite_video_category_transaction"
            WHERE user_id = ${frontUserId} AND
            video_id = ${videoId} AND
            delete_flg = '0'
            `;

        return favoriteVideoCategory;
    }
}