import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetVideoListRepositoryInterface } from "../interface/GetVideoListRepositoryInterface";
import { GetVideoListSelectEntity } from "../../entity/GetVideoListSelectEntity";



/**
 * 永続ロジック用クラス
 */
export class GetVideoListRepositoryPostgres implements GetVideoListRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectVideo(getVideoListSelectEntity: GetVideoListSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getVideoListSelectEntity.frontUserId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT 
                video_id as "videoId"
            FROM 
                "favorite_video_transaction" a
            WHERE 
                a.user_id = ${frontUserId} AND
                a.delete_flg = '0'
            `;

        return favoriteVideoList;
    }
}