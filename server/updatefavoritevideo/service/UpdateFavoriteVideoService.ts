import { FavoriteVideoCategoryTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoRequestModel } from "../model/UpdateFavoriteVideoRequestModel";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionInsertEntity";
import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { FavoriteVideoCategoryTransactionRepositorys } from "../../internaldata/favoritevideocateorytransaction/repository/FavoriteVideoCategoryTransactionRepositorys";
import { FavoriteVideoCategoryTransactionRepositoryInterface } from "../../internaldata/favoritevideocateorytransaction/repository/interface/FavoriteVideoCategoryTransactionRepositoryInterface";
import { FavoriteVideoCategoryTransactionInsertEntity } from "../../internaldata/favoritevideocateorytransaction/entity/FavoriteVideoCategoryTransactionInsertEntity";
import { FavoriteVideoTransactionUpdateEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionUpdateEntity";
import { UpdateFavoriteVideoRepositorys } from "../repository/UpdateFavoriteVideoRepositorys";
import { UpdateFavoriteVideoRepositoryInterface } from "../repository/interface/UpdateFavoriteVideoRepositoryInterface";
import { UpdateFavoriteVideoSelectEntity } from "../entity/UpdateFavoriteVideoSelectEntity";


export class UpdateFavoriteVideoService {

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
     * お気に入り動画更新の永続ロジックを取得
     * @returns 
     */
    public getUpdateFavoriteVideoRepository(): UpdateFavoriteVideoRepositoryInterface {
        return (new UpdateFavoriteVideoRepositorys()).get(RepositoryType.POSTGRESQL);
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
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
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
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
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
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteVideo = favoriteVideoRepository.update(
            new FavoriteVideoTransactionUpdateEntity(
                frontUserIdModel,
                updateFavoriteVideoRequestModel.videoIdModel,
                updateFavoriteVideoRequestModel.summaryModel,
                updateFavoriteVideoRequestModel.viewStatusModel,
                updateFavoriteVideoRequestModel.favoriteLevelModel,
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
    public async checkExistFavoriteVideo(getUpdateFavoriteVideoRepository: UpdateFavoriteVideoRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const updateFavoriteVideoSelectEntity = new UpdateFavoriteVideoSelectEntity(
            frontUserIdModel,
            updateFavoriteVideoRequestModel.videoIdModel
        );

        // お気に入り動画を取得
        const favoriteVideoList = await getUpdateFavoriteVideoRepository.select(updateFavoriteVideoSelectEntity);

        return favoriteVideoList.length > 0;
    }
}