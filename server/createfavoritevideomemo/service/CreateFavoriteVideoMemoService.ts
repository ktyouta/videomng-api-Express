import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CreateFavoriteVideoDetailSelectEntity } from "../entity/CreateFavoriteVideoDetailSelectEntity";
import { CreateFavoriteVideoMemoRequestModel } from "../model/CreateFavoriteVideoMemoRequestModel";
import { CreateFavoriteVideoMemoRepositorys } from "../repository/CreateFavoriteVideoMemoRepositorys";
import { CreateFavoriteVideoMemoRepositoryInterface } from "../repository/interface/CreateFavoriteVideoMemoRepositoryInterface";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../internaldata/favoritevideomemotransaction/entity/FavoriteVideoMemoTransactionInsertEntity";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { CreateFavoriteVideoMemoSeqSelectEntity } from "../entity/CreateFavoriteVideoMemoSeqSelectEntity";


export class CreateFavoriteVideoMemoService {

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
     * @param createFavoriteVideoMemoRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkExistFavoriteVideoMemo(createFavoriteVideoMemoRepository: CreateFavoriteVideoMemoRepositoryInterface,
        createFavoriteVideoMemoRequestModel: CreateFavoriteVideoMemoRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const createFavoriteVideoMemoSelectEntity = new CreateFavoriteVideoDetailSelectEntity(
            frontUserIdModel, createFavoriteVideoMemoRequestModel.videoIdModel);

        // お気に入り動画を取得
        const favoriteVideoMemoList = await createFavoriteVideoMemoRepository.select(createFavoriteVideoMemoSelectEntity);

        return favoriteVideoMemoList.length > 0;
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