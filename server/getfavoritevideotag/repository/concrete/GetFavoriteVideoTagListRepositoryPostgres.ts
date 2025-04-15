import { FavoriteVideoTagTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoTagListSelectEntity } from "../../entity/GetFavoriteVideoTagListSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFavoriteVideoTagListRepositoryInterface } from "../interface/GetFavoriteVideoTagListRepositoryInterface";
import { FavoriteVideoTagType } from "../../type/FavoriteVideoTagType";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoTagListRepositoryPostgres implements GetFavoriteVideoTagListRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入りコメント取得
     * @returns 
     */
    async select(getFavoriteVideoTagListSelectEntity: GetFavoriteVideoTagListSelectEntity): Promise<FavoriteVideoTagType[]> {

        const frontUserId = getFavoriteVideoTagListSelectEntity.frontUserId;
        const videoId = getFavoriteVideoTagListSelectEntity.videoId;

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