import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { CreateFavoriteVideoSelectEntity } from "../entity/CreateFavoriteVideoSelectEntity";
import { CreateFavoriteVideoRequestModel } from "../model/CreateFavoriteVideoRequestModel";
import { CreateFavoriteVideoRepositorys } from "../repository/CreateFavoriteVideoRepositorys";
import { CreateFavoriteVideoRepositoryInterface } from "../repository/interface/CreateFavoriteVideoRepositoryInterface";


export class CreateFavoriteVideoService {


    /**
     * お気に入り動画の重複チェック
     * @param createFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkDupulicateFavoriteVideo(createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // 永続ロジックを取得
        const createFavoriteVideoRepository: CreateFavoriteVideoRepositoryInterface =
            (new CreateFavoriteVideoRepositorys()).get(RepositoryType.POSTGRESQL);

        // お気に入り動画取得Entity
        const createFavoriteVideoSelectEntity = new CreateFavoriteVideoSelectEntity(
            frontUserIdModel, createFavoriteVideoRequestModel.videoIdModel);

        // お気に入り動画を取得
        const favoriteVideoList = await createFavoriteVideoRepository.select(createFavoriteVideoSelectEntity);

        return favoriteVideoList.length > 0
    }


    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoRepository(): FavoriteVideoTransactionRepositoryInterface {
        return (new FavoriteVideoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画コメントの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoMemoRepository(): FavoriteVideoMemoTransactionRepositoryInterface {
        return (new FavoriteVideoMemoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画に動画を追加する
     * @param favoriteVideoRepository 
     * @param createFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async insert(favoriteVideoRepository: FavoriteVideoTransactionRepositoryInterface,
        createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteVideoInsertEntity = await FavoriteVideoTransactionInsertEntity.create(
            frontUserIdModel,
            createFavoriteVideoRequestModel.videoIdModel);

        await favoriteVideoRepository.insert(favoriteVideoInsertEntity, tx);
    }

    /**
     * 削除動画を復元する
     * @param favoriteVideoRepository 
     * @param createFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async recoveryVideo(favoriteVideoRepository: FavoriteVideoTransactionRepositoryInterface,
        createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        await favoriteVideoRepository.recovery(frontUserIdModel, createFavoriteVideoRequestModel.videoIdModel, tx);
    }


    /**
     * 削除コメントを復元する
     * @param favoriteVideoRepository 
     * @param createFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async recoveryMemo(favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        await favoriteVideoMemoRepository.recovery(frontUserIdModel, createFavoriteVideoRequestModel.videoIdModel, tx);
    }
}