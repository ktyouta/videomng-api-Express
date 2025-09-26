import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { RegisteredVideoListEntity } from "../../entity/RegisteredVideoListEntity";
import { UploadFavoriteVideoListCsvRepositoryInterface } from "../interface/UploadFavoriteVideoListCsvRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";



/**
 * json形式の永続ロジック用クラス
 */
export class UploadFavoriteVideoListCsvRepositoryPostgres implements UploadFavoriteVideoListCsvRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoInfoMasterModel 
     * @returns 
     */
    public async select(registeredVideoListEntity: RegisteredVideoListEntity, tx: Prisma.TransactionClient): Promise<FavoriteVideoTransaction[]> {

        const userId = registeredVideoListEntity.frontUserId;
        const videoIdList = registeredVideoListEntity.videoIdList;

        const favoriteVideoList = await tx.favoriteVideoTransaction.findMany({
            where: {
                videoId: { in: videoIdList },
                userId,
            },
        });

        return favoriteVideoList;
    }

}