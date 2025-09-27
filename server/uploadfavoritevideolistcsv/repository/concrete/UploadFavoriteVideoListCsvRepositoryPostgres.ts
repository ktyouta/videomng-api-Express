import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { RegisteredVideoListEntity } from "../../entity/RegisteredVideoListEntity";
import { UploadFavoriteVideoListCsvRepositoryInterface } from "../interface/UploadFavoriteVideoListCsvRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FLG } from "../../../util/const/CommonConst";
import { UpdateVideoListEntity } from "../../entity/UpdateVideoListEntity";



/**
 * json形式の永続ロジック用クラス
 */
export class UploadFavoriteVideoListCsvRepositoryPostgres implements UploadFavoriteVideoListCsvRepositoryInterface {

    constructor() {
    }


    /**
     * 削除フラグを元に戻す
     * @param frontFavoriteVideoInfoMasterModel 
     * @returns 
     */
    public async updateDeleteFlg(updateVideoListEntity: UpdateVideoListEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const userId = updateVideoListEntity.frontUserId;
        const registerVideoIdList = updateVideoListEntity.registerVideoIdList;

        const favoriteVideoList = await tx.favoriteVideoTransaction.updateMany({
            where: {
                videoId: { in: registerVideoIdList },
                userId,
                deleteFlg: FLG.ON,
            },
            data: {
                deleteFlg: FLG.OFF
            }
        });

        return favoriteVideoList;
    }

    /**
     * お気に入りに登録する
     * @param frontFavoriteVideoInfoMasterModel 
     * @returns 
     */
    public async register(registeredVideoListEntity: RegisteredVideoListEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const userId = registeredVideoListEntity.frontUserId;
        const registerVideoIdList = registeredVideoListEntity.registerVideoIdList;

        const favoriteVideoList = await tx.favoriteVideoTransaction.createMany({
            data: registerVideoIdList.map((e) => {
                return {
                    videoId: e,
                    userId,
                    deleteFlg: FLG.OFF,
                    createDate: new Date(),
                    updateDate: new Date(),
                }
            }),
            skipDuplicates: true,
        });

        return favoriteVideoList;
    }
}