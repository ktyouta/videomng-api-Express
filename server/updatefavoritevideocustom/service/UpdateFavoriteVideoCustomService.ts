import { FavoriteVideoCategoryTransaction, Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteVideoCategoryTransactionInsertEntity } from "../../internaldata/favoritevideocateorytransaction/entity/FavoriteVideoCategoryTransactionInsertEntity";
import { FavoriteVideoCategoryTransactionRepositorys } from "../../internaldata/favoritevideocateorytransaction/repository/FavoriteVideoCategoryTransactionRepositorys";
import { FavoriteVideoCategoryTransactionRepositoryInterface } from "../../internaldata/favoritevideocateorytransaction/repository/interface/FavoriteVideoCategoryTransactionRepositoryInterface";
import { FavoriteVideoTransactionUpdateEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionUpdateEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { UpdateFavoriteVideoCustomSelectEntity } from "../entity/UpdateFavoriteVideoCustomSelectEntity";
import { UpdateFavoriteVideoCustomRequestModel } from "../model/UpdateFavoriteVideoCustomRequestModel";
import { UpdateFavoriteVideoCustomRepositorys } from "../repository/UpdateFavoriteVideoCustomRepositorys";
import { UpdateFavoriteVideoCustomRepositoryInterface } from "../repository/interface/UpdateFavoriteVideoCustomRepositoryInterface";


export class UpdateFavoriteVideoCustomService {

    /**
     * お気に入り動画更新の永続ロジックを取得
     * @returns 
     */
    public getUpdateFavoriteVideoRepository(): UpdateFavoriteVideoCustomRepositoryInterface {
        return (new UpdateFavoriteVideoCustomRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画カテゴリの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoCategoryRepository(): FavoriteVideoCategoryTransactionRepositoryInterface {
        return (new FavoriteVideoCategoryTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoRepository(): FavoriteVideoTransactionRepositoryInterface {
        return (new FavoriteVideoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画コメントを削除する
     * @param favoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteCategory(favoriteVideoCategoryRepository: FavoriteVideoCategoryTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoCustomRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoCategoryRepository.delete(
            frontUserIdModel,
            updateFavoriteVideoRequestModel.videoIdModel,
            tx);
    }

    /**
     * お気に入り動画カテゴリにデータを追加する
     * @param favoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async insertCategory(favoriteVideoCategoryRepository: FavoriteVideoCategoryTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoCustomRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const categoryList: FavoriteVideoCategoryTransaction[] = await Promise.all(updateFavoriteVideoRequestModel.categoryIdModelList.map((e) => {

            return favoriteVideoCategoryRepository.insert(
                new FavoriteVideoCategoryTransactionInsertEntity(
                    frontUserIdModel,
                    updateFavoriteVideoRequestModel.videoIdModel,
                    e
                ), tx);
        }));

        return categoryList;
    }


    /**
     * お気に入り動画を更新する
     * @param favoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async updateFavoriteVideo(favoriteVideoRepository: FavoriteVideoTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoCustomRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteVideo = favoriteVideoRepository.update(
            new FavoriteVideoTransactionUpdateEntity(
                frontUserIdModel,
                updateFavoriteVideoRequestModel.videoIdModel,
                updateFavoriteVideoRequestModel.summaryModel,
                updateFavoriteVideoRequestModel.viewStatusModel,
                updateFavoriteVideoRequestModel.favoriteLevelModel,
                updateFavoriteVideoRequestModel.isVisibleAfterFolderAddModel,
            ), tx);

        return favoriteVideo;
    }


    /**
     * お気に入り動画の存在チェック
     * @param getUpdateFavoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkExistFavoriteVideo(getUpdateFavoriteVideoRepository: UpdateFavoriteVideoCustomRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoCustomRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const updateFavoriteVideoSelectEntity = new UpdateFavoriteVideoCustomSelectEntity(
            frontUserIdModel,
            updateFavoriteVideoRequestModel.videoIdModel
        );

        // お気に入り動画を取得
        const favoriteVideoList = await getUpdateFavoriteVideoRepository.select(updateFavoriteVideoSelectEntity);

        return favoriteVideoList.length > 0;
    }
}