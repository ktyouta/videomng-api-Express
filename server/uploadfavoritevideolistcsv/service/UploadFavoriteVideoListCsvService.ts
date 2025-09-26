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
import { VideoIdListModel } from "../model/VideoIdListModel";
import { UploadFavoriteVideoListCsvRepositorys } from "../repository/UploadFavoriteVideoListCsvRepositorys";
import { RegisteredVideoListEntity } from "../entity/RegisteredVideoListEntity";


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
     * 登録済みの動画リストを取得
     * @param frontUserIdModel 
     * @param videoIdListModel 
     */
    async selectRegisteredVideoList(
        frontUserIdModel: FrontUserIdModel,
        videoIdListModel: VideoIdListModel,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoTransaction[]> {

        const registeredVideoListEntity = new RegisteredVideoListEntity(frontUserIdModel, videoIdListModel);

        const uploadFavoriteVideoListCsvRepositorys = this._uploadFavoriteVideoListCsvRepositorys.get(RepositoryType.POSTGRESQL);

        return await uploadFavoriteVideoListCsvRepositorys.select(registeredVideoListEntity, tx);
    }

    /**
     * 削除済み(更新対象)の動画リストを取得
     * @param favoriteVideoTransaction 
     * @returns 
     */
    getUpdateVideoList(favoriteVideoTransaction: FavoriteVideoTransaction[]) {

        return favoriteVideoTransaction.filter((e) => {
            return e.deleteFlg === FLG.ON;
        })
    }
}