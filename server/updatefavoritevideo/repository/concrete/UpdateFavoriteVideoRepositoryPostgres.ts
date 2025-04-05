import { FavoriteVideoTransaction } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { UpdateFavoriteVideoRepositoryInterface } from "../interface/UpdateFavoriteVideoRepositoryInterface";
import { UpdateFavoriteVideoSelectEntity } from "../../entity/UpdateFavoriteVideoSelectEntity";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFavoriteVideoRepositoryPostgres implements UpdateFavoriteVideoRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoInfoMasterModel 
     * @returns 
     */
    public async select(updateFavoriteVideoSelectEntity: UpdateFavoriteVideoSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const userId = updateFavoriteVideoSelectEntity.frontUserId;
        const videoId = updateFavoriteVideoSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoList;
    }

}