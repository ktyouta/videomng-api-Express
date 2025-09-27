import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { RegisterVideoIdListModel } from "../model/RegisterVideoIdListModel";
import { UploadFavoriteVideoListCsvRepositorys } from "../repository/UploadFavoriteVideoListCsvRepositorys";
import { RegisteredVideoListEntity } from "../entity/RegisteredVideoListEntity";
import { UpdateVideoListEntity } from "../entity/UpdateVideoListEntity";


export class UploadFavoriteVideoListCsvService {

    private readonly _uploadFavoriteVideoListCsvRepositorys = new UploadFavoriteVideoListCsvRepositorys();

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    checkJwtVerify(req: Request) {

        try {

            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`お気に入り動画登録時の認証エラー ERROR:${err}`);
        }
    }

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