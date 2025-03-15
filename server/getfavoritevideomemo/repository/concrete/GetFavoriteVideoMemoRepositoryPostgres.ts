import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteVideoMemoSelectEntity } from "../../entity/GetFavoriteVideoMemoSelectEntity";
import { GetFavoriteVideoMemoRepositoryInterface } from "../interface/GetFavoriteVideoMemoRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoMemoRepositoryPostgres implements GetFavoriteVideoMemoRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画メモ取得
     * @returns 
     */
    async selectVideoMemo(getFavoriteVideoMemoSelectEntity: GetFavoriteVideoMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]> {

        const frontUserId = getFavoriteVideoMemoSelectEntity.frontUserId;
        const videoId = getFavoriteVideoMemoSelectEntity.videoId;

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
}