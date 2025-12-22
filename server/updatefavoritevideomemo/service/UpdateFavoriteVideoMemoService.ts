import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteVideoMemoTransactionUpdateEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionUpdateEntity";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoDetailSelectEntity } from "../entity/UpdateFavoriteVideoDetailSelectEntity";
import { UpdateFavoriteVideoMemoRequestModel } from "../model/UpdateFavoriteVideoMemoRequestModel";
import { UpdateFavoriteVideoMemoRepositorys } from "../repository/UpdateFavoriteVideoMemoRepositorys";
import { UpdateFavoriteVideoMemoRepositoryInterface } from "../repository/interface/UpdateFavoriteVideoMemoRepositoryInterface";


export class UpdateFavoriteVideoMemoService {

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
        const favoriteVideoList = await updateFavoriteVideoMemoRepository.select(updateFavoriteVideoMemoSelectEntity);

        return favoriteVideoList.length > 0;
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