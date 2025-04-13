import { FavoriteVideoTagTransaction } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { UpdateFavoriteVideoTagSelectEntity } from "../../entity/UpdateFavoriteVideoTagSelectEntity";
import { UpdateFavoriteVideoTagRepositoryInterface } from "../interface/UpdateFavoriteVideoTagRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFavoriteVideoTagRepositoryPostgres implements UpdateFavoriteVideoTagRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    public async select(updateFavoriteVideoTagSelectEntity: UpdateFavoriteVideoTagSelectEntity): Promise<FavoriteVideoTagTransaction[]> {

        const userId = updateFavoriteVideoTagSelectEntity.frontUserId;
        const videoId = updateFavoriteVideoTagSelectEntity.videoId;

        const favoriteVideoTagList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTagTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoTagList;
    }

}