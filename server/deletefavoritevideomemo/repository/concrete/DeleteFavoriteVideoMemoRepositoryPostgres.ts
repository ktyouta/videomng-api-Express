import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { DeleteFavoriteVideoDetailSelectEntity } from "../../entity/DeleteFavoriteVideoDetailSelectEntity";
import { DeleteFavoriteVideoMemoRepositoryInterface } from "../interface/DeleteFavoriteVideoMemoRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class DeleteFavoriteVideoMemoRepositoryPostgres implements DeleteFavoriteVideoMemoRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoMemoInfoMasterModel 
     * @returns 
     */
    public async select(deleteFavoriteVideoMemoSelectEntity: DeleteFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const userId = deleteFavoriteVideoMemoSelectEntity.frontUserId;
        const videoId = deleteFavoriteVideoMemoSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoList;
    }

}