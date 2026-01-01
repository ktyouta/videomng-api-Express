import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { CreateFavoriteVideoSelectEntity } from "../../entity/CreateFavoriteVideoSelectEntity";
import { CreateFavoriteVideoRepositoryInterface } from "../interface/CreateFavoriteVideoRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFavoriteVideoRepositoryPostgres implements CreateFavoriteVideoRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoInfoMasterModel 
     * @returns 
     */
    public async select(createFavoriteVideoSelectEntity: CreateFavoriteVideoSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const userId = createFavoriteVideoSelectEntity.frontUserId;
        const videoId = createFavoriteVideoSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoList;
    }

}