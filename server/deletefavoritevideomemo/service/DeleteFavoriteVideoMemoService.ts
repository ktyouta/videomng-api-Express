import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { DeleteFavoriteVideoDetailSelectEntity } from "../entity/DeleteFavoriteVideoDetailSelectEntity";
import { DeleteFavoriteVideoMemoRequestModel } from "../model/DeleteFavoriteVideoMemoRequestModel";
import { DeleteFavoriteVideoMemoRepositorys } from "../repository/DeleteFavoriteVideoMemoRepositorys";
import { DeleteFavoriteVideoMemoRepositoryInterface } from "../repository/interface/DeleteFavoriteVideoMemoRepositoryInterface";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionInsertEntity";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { FavoriteVideoMemoTransactionSoftDeleteEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionSoftDeleteEntity";


export class DeleteFavoriteVideoMemoService {

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
            throw Error(`お気に入り動画登録時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画の存在チェック
     * @param deleteFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkExistFavoriteVideoMemo(deleteFavoriteVideoMemoRepository: DeleteFavoriteVideoMemoRepositoryInterface,
        deleteFavoriteVideoMemoRequestModel: DeleteFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const deleteFavoriteVideoMemoSelectEntity = new DeleteFavoriteVideoDetailSelectEntity(
            frontUserIdModel, deleteFavoriteVideoMemoRequestModel.videoIdModel);

        // お気に入り動画を取得
        const favoriteVideoMemoList = await deleteFavoriteVideoMemoRepository.select(deleteFavoriteVideoMemoSelectEntity);

        return favoriteVideoMemoList.length > 0;
    }


    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getDeleteFavoriteVideoMemoRepository(): DeleteFavoriteVideoMemoRepositoryInterface {
        return (new DeleteFavoriteVideoMemoRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoMemoRepository(): FavoriteVideoMemoTransactionRepositoryInterface {
        return (new FavoriteVideoMemoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画メモを削除する
     * @param favoriteVideoMemoRepository 
     * @param deleteFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     */
    public async softDelete(deleteFavoriteVideoMemoRepository: DeleteFavoriteVideoMemoRepositoryInterface,
        favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        deleteFavoriteVideoMemoRequestModel: DeleteFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteVideoMemoTransactionSoftDeleteEntity = new FavoriteVideoMemoTransactionSoftDeleteEntity(
            frontUserIdModel,
            deleteFavoriteVideoMemoRequestModel.videoIdModel,
            deleteFavoriteVideoMemoRequestModel.videoMemoSeqModel,
        );

        // メモ削除
        const favoriteVideoMemo = await favoriteVideoMemoRepository.softDelete(favoriteVideoMemoTransactionSoftDeleteEntity, tx);

        return favoriteVideoMemo;
    }

}