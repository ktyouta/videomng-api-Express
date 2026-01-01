import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteVideoMemoTransactionSoftDeleteEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionSoftDeleteEntity";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { DeleteFavoriteVideoDetailSelectEntity } from "../entity/DeleteFavoriteVideoDetailSelectEntity";
import { DeleteFavoriteVideoMemoRequestModel } from "../model/DeleteFavoriteVideoMemoRequestModel";
import { DeleteFavoriteVideoMemoRepositorys } from "../repository/DeleteFavoriteVideoMemoRepositorys";
import { DeleteFavoriteVideoMemoRepositoryInterface } from "../repository/interface/DeleteFavoriteVideoMemoRepositoryInterface";


export class DeleteFavoriteVideoMemoService {

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
        const favoriteVideoList = await deleteFavoriteVideoMemoRepository.select(deleteFavoriteVideoMemoSelectEntity);

        return favoriteVideoList.length > 0;
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
    public async softDelete(favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
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