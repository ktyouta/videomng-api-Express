import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetVideoListSelectEntity } from "../../entity/GetVideoListSelectEntity";
import { GetVideoListRepositoryInterface } from "../interface/GetVideoListRepositoryInterface";



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
                a.user_id = CAST(${frontUserId} AS INTEGER) AND
                a.delete_flg = '0'
            `;

        return favoriteVideoList;
    }
}