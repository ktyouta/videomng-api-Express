import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionInsertEntity";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
import { CreateFavoriteVideoDetailSelectEntity } from "../entity/CreateFavoriteVideoDetailSelectEntity";
import { CreateFavoriteVideoMemoSeqSelectEntity } from "../entity/CreateFavoriteVideoMemoSeqSelectEntity";
import { CreateFavoriteVideoMemoRequestModel } from "../model/CreateFavoriteVideoMemoRequestModel";
import { CreateFavoriteVideoMemoRepositorys } from "../repository/CreateFavoriteVideoMemoRepositorys";
import { CreateFavoriteVideoMemoRepositoryInterface } from "../repository/interface/CreateFavoriteVideoMemoRepositoryInterface";


export class CreateFavoriteVideoMemoService {

    /**
     * お気に入り動画の存在チェック
     * @param createFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkExistFavoriteVideoMemo(createFavoriteVideoMemoRepository: CreateFavoriteVideoMemoRepositoryInterface,
        createFavoriteVideoMemoRequestModel: CreateFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const createFavoriteVideoDetailSelectEntity = new CreateFavoriteVideoDetailSelectEntity(
            frontUserIdModel, createFavoriteVideoMemoRequestModel.videoIdModel);

        // お気に入り動画を取得
        const favoriteVideoList = await createFavoriteVideoMemoRepository.select(createFavoriteVideoDetailSelectEntity);

        return favoriteVideoList.length > 0;
    }


    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getCreateFavoriteVideoMemoRepository(): CreateFavoriteVideoMemoRepositoryInterface {
        return (new CreateFavoriteVideoMemoRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoMemoRepository(): FavoriteVideoMemoTransactionRepositoryInterface {
        return (new FavoriteVideoMemoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画メモを追加する
     * @param favoriteVideoMemoRepository 
     * @param createFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     */
    public async insert(createFavoriteVideoMemoRepository: CreateFavoriteVideoMemoRepositoryInterface,
        favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        createFavoriteVideoMemoRequestModel: CreateFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const videoIdModel = createFavoriteVideoMemoRequestModel.videoIdModel;

        const createFavoriteVideoMemoSeqSelectEntity = new CreateFavoriteVideoMemoSeqSelectEntity(
            frontUserIdModel,
            videoIdModel
        );

        // メモのシーケンス番号を取得
        const seqObjList = await createFavoriteVideoMemoRepository.selectMemoSeq(
            createFavoriteVideoMemoSeqSelectEntity
        );

        const nextSeq = seqObjList[0].nextSeq;

        const favoriteVideoMemoInsertEntity = new FavoriteVideoMemoTransactionInsertEntity(
            frontUserIdModel,
            videoIdModel,
            new VideoMemoSeqModel(nextSeq),
            createFavoriteVideoMemoRequestModel.memoModel,
        );

        // メモ登録
        const favoriteVideoMemo = await favoriteVideoMemoRepository.insert(favoriteVideoMemoInsertEntity, tx);

        return favoriteVideoMemo;
    }

}