import { FavoriteVideoTransaction } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { UpdateFavoriteVideoCustomRepositoryInterface } from "../interface/UpdateFavoriteVideoCustomRepositoryInterface";
import { UpdateFavoriteVideoCustomSelectEntity } from "../../entity/UpdateFavoriteVideoCustomSelectEntity";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFavoriteVideoCustomRepositoryPostgres implements UpdateFavoriteVideoCustomRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoInfoMasterModel 
     * @returns 
     */
    public async select(updateFavoriteVideoSelectEntity: UpdateFavoriteVideoCustomSelectEntity): Promise<FavoriteVideoTransaction[]> {

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