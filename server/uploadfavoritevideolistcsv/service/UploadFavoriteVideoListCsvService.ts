import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RegisteredVideoListEntity } from "../entity/RegisteredVideoListEntity";
import { UpdateVideoListEntity } from "../entity/UpdateVideoListEntity";
import { RegisterVideoIdListModel } from "../model/RegisterVideoIdListModel";
import { UploadFavoriteVideoListCsvRepositorys } from "../repository/UploadFavoriteVideoListCsvRepositorys";


export class UploadFavoriteVideoListCsvService {

    private readonly _uploadFavoriteVideoListCsvRepositorys = new UploadFavoriteVideoListCsvRepositorys();

    /**
     * 削除フラグをオフに戻す
     * @param frontUserIdModel 
     * @param registerVideoIdListModel 
     */
    async updateDeleteFlg(
        frontUserIdModel: FrontUserIdModel,
        registerVideoIdListModel: RegisterVideoIdListModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const updateVideoListEntity = new UpdateVideoListEntity(frontUserIdModel, registerVideoIdListModel);

        const uploadFavoriteVideoListCsvRepositorys = this._uploadFavoriteVideoListCsvRepositorys.get(RepositoryType.POSTGRESQL);

        return await uploadFavoriteVideoListCsvRepositorys.updateDeleteFlg(updateVideoListEntity, tx);
    }

    /**
     * 動画を登録する
     * @param frontUserIdModel 
     * @param registerVideoIdListModel 
     * @param tx 
     * @returns 
     */
    async register(
        frontUserIdModel: FrontUserIdModel,
        registerVideoIdListModel: RegisterVideoIdListModel,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const registeredVideoListEntity = new RegisteredVideoListEntity(frontUserIdModel, registerVideoIdListModel);

        const uploadFavoriteVideoListCsvRepositorys = this._uploadFavoriteVideoListCsvRepositorys.get(RepositoryType.POSTGRESQL);

        return await uploadFavoriteVideoListCsvRepositorys.register(registeredVideoListEntity, tx);
    }
}