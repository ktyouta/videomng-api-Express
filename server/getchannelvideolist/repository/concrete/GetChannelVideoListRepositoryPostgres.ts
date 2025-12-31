import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetChannelVideoListSelectEntity } from "../../entity/GetChannelVideoListSelectEntity";
import { GetChannelVideoListRepositoryInterface } from "../interface/GetChannelVideoListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetChannelVideoListRepositoryPostgres implements GetChannelVideoListRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectVideo(getChannelVideoListSelectEntity: GetChannelVideoListSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getChannelVideoListSelectEntity.frontUserId;

        const favoriteChannelVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT 
                video_id as "videoId"
            FROM 
                "favorite_video_transaction" a
            WHERE 
                a.user_id = CAST(${frontUserId} AS INTEGER) AND
                a.delete_flg = '0'
            `;

        return favoriteChannelVideoList;
    }
}