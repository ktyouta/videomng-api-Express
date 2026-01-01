import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { UpdateFavoriteVideoDetailSelectEntity } from "../../entity/UpdateFavoriteVideoDetailSelectEntity";
import { UpdateFavoriteVideoMemoRepositoryInterface } from "../interface/UpdateFavoriteVideoMemoRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFavoriteVideoMemoRepositoryPostgres implements UpdateFavoriteVideoMemoRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoMemoInfoMasterModel 
     * @returns 
     */
    public async select(updateFavoriteVideoMemoSelectEntity: UpdateFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const userId = updateFavoriteVideoMemoSelectEntity.frontUserId;
        const videoId = updateFavoriteVideoMemoSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoList;
    }

}