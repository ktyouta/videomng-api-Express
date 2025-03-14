import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoDetialRepositoryInterface } from "../interface/GetFavoriteVideoDetialRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteVideoDetialSelectEntity } from "../../entity/GetFavoriteVideoDetialSelectEntity";



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
    async selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getFavoriteVideoDetialSelectEntity.frontUserId;
        const videoId = getFavoriteVideoDetialSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT 
                user_id as "userId",
                video_id as "videoId"  
            FROM "favorite_video_transaction" 
            WHERE user_id = ${frontUserId} AND
            video_id = ${videoId} AND
            delete_flg = '0'
            `;

        return favoriteVideoList;
    }

    /**
     * お気に入り動画コメント取得
     * @returns 
     */
    async selectVideoMemo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoDetialSelectEntity): Promise<FavoriteVideoMemoTransaction[]> {

        const frontUserId = getFavoriteVideoDetialSelectEntity.frontUserId;
        const videoId = getFavoriteVideoDetialSelectEntity.videoId;

        const favoriteVideoMemo = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoMemoTransaction[]>`
            SELECT 
                user_id as "userId",
                video_id as "videoId",
                video_memo_seq as "videoMemoSeq",
                video_memo as "videoMemo"
            FROM "favorite_video_memo_transaction" 
            WHERE user_id = ${frontUserId} AND
            video_id = ${videoId} AND
            delete_flg = '0'
            `;

        return favoriteVideoMemo;
    }
}