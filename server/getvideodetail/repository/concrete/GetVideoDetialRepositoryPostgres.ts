import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetVideoDetialRepositoryInterface } from "../interface/GetVideoDetialRepositoryInterface";
import { GetVideoDetialSelectEntity } from "../../entity/GetVideoDetialSelectEntity";



/**
 * 永続ロジック用クラス
 */
export class GetVideoDetialRepositoryPostgres implements GetVideoDetialRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectVideo(getVideoDetialSelectEntity: GetVideoDetialSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getVideoDetialSelectEntity.frontUserId;
        const videoId = getVideoDetialSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT 
                *
            FROM 
                "favorite_video_transaction" a
            WHERE 
                a.user_id = ${frontUserId} AND
                a.video_id = ${videoId} AND
                a.delete_flg = '0'
            `;

        return favoriteVideoList;
    }
}