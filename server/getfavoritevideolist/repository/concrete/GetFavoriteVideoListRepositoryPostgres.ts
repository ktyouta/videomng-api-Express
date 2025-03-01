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
    async select(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getFavoriteVideoListSelectEntity.frontUserId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = ${frontUserId} AND
            delete_flg = '0'
            `;

        return favoriteVideoList;
    }

}