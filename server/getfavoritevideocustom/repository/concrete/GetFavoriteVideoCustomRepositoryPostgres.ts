import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoCustomRepositoryInterface } from "../interface/GetFavoriteVideoCustomRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteVideoDetialSelectEntity } from "../../../getfavoritevideodetail/entity/GetFavoriteVideoDetialSelectEntity";
import { FavoriteVideoDetailType } from "../../type/FavoriteVideoDetailType";
import { GetFavoriteVideoCustomCategorySelectEntity } from "../../entity/GetFavoriteVideoCustomCategorySelectEntity";
import { FavoriteVideoDetailCategoryType } from "../../type/FavoriteVideoDetailCategoryType";
import { GetFavoriteVideoCustomMemoSelectEntity } from "../../entity/GetFavoriteVideoCustomMemoSelectEntity";
import { GetFavoriteVideoCustomSelectEntity } from "../../entity/GetFavoriteVideoCustomSelectEntity";
import { SelectTagListEntity } from "../../entity/SelectTagListEntity";
import { FavoriteVideoTagType } from "../../type/FavoriteVideoTagType";


/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoCustomRepositoryPostgres implements GetFavoriteVideoCustomRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoCustomSelectEntity): Promise<FavoriteVideoDetailType[]> {

        const frontUserId = getFavoriteVideoDetialSelectEntity.frontUserId;
        const videoId = getFavoriteVideoDetialSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoDetailType[]>`
            SELECT 
                a.user_id as "userId",
                a.video_id as "videoId",
                COALESCE(a.summary, '') AS "summary",
                a.view_status as "viewStatus",
                b.label as "viewStatusName",
                a.favorite_level as "favoriteLevel",
                a.create_date as "createDate",
                a.update_date as "updateDate",
                a.is_visible_after_folder_add as "isVisibleAfterFolderAdd"
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
    async selectVideoMemo(getFavoriteVideoDetialMemoSelectEntity: GetFavoriteVideoCustomMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]> {

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
    async selectVideoCategory(getFavoriteVideoDetialCategorySelectEntity: GetFavoriteVideoCustomCategorySelectEntity): Promise<FavoriteVideoDetailCategoryType[]> {

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

    /**
     * お気に入りコメント取得
     * @returns 
     */
    async selectVideoTag(entity: SelectTagListEntity): Promise<FavoriteVideoTagType[]> {

        const frontUserId = entity.frontUserId;
        const videoId = entity.videoId;

        const favoriteVideoTag = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTagType[]>`
            SELECT
                a.user_id as "userId",
                a.video_id as "videoId",
                a.tag_id as "tagId",
                b.tag_name as "tagName"
            FROM "favorite_video_tag_transaction" a
            INNER JOIN "tag_master" b 
            ON a.user_id = b.user_id AND
            a.tag_id = b.tag_id
            WHERE a.user_id = ${frontUserId} AND
            a.video_id = ${videoId} AND
            a.delete_flg = '0'
            `;

        return favoriteVideoTag;
    }
}