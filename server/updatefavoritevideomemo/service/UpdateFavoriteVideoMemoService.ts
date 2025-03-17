import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoMemoRequestModel } from "../model/UpdateFavoriteVideoMemoRequestModel";
import { UpdateFavoriteVideoMemoRepositorys } from "../repository/UpdateFavoriteVideoMemoRepositorys";
import { UpdateFavoriteVideoMemoRepositoryInterface } from "../repository/interface/UpdateFavoriteVideoMemoRepositoryInterface";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionInsertEntity";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { FavoriteVideoMemoTransactionSoftDeleteEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionSoftDeleteEntity";
import { UpdateFavoriteVideoDetailSelectEntity } from "../entity/UpdateFavoriteVideoDetailSelectEntity";
import { FavoriteVideoMemoTransactionUpdateEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionUpdateEntity";


export class UpdateFavoriteVideoMemoService {

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {

            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`お気に入り動画更新時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画の存在チェック
     * @param updateFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkExistFavoriteVideoMemo(updateFavoriteVideoMemoRepository: UpdateFavoriteVideoMemoRepositoryInterface,
        updateFavoriteVideoMemoRequestModel: UpdateFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const updateFavoriteVideoMemoSelectEntity = new UpdateFavoriteVideoDetailSelectEntity(
            frontUserIdModel, updateFavoriteVideoMemoRequestModel.videoIdModel);

        // お気に入り動画を取得
        const favoriteVideoMemoList = await updateFavoriteVideoMemoRepository.select(updateFavoriteVideoMemoSelectEntity);

        return favoriteVideoMemoList.length > 0;
    }


    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getUpdateFavoriteVideoMemoRepository(): UpdateFavoriteVideoMemoRepositoryInterface {
        return (new UpdateFavoriteVideoMemoRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoMemoRepository(): FavoriteVideoMemoTransactionRepositoryInterface {
        return (new FavoriteVideoMemoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画メモを更新する
     * @param favoriteVideoMemoRepository 
     * @param updateFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     */
    public async update(updateFavoriteVideoMemoRepository: UpdateFavoriteVideoMemoRepositoryInterface,
        favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        updateFavoriteVideoMemoRequestModel: UpdateFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteVideoMemoTransactionUpdateEntity = new FavoriteVideoMemoTransactionUpdateEntity(
            frontUserIdModel,
            updateFavoriteVideoMemoRequestModel.videoIdModel,
            updateFavoriteVideoMemoRequestModel.videoMemoSeqModel,
            updateFavoriteVideoMemoRequestModel.memoModel,
        );

        // メモ更新
        const favoriteVideoMemo = await favoriteVideoMemoRepository.update(favoriteVideoMemoTransactionUpdateEntity, tx);

        return favoriteVideoMemo;
    }

}