import { Prisma } from "@prisma/client";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
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
     * お気に入り動画コメントの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoMemoRepository(): FavoriteVideoMemoTransactionRepositoryInterface {
        return (new FavoriteVideoMemoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画コメントを削除する
     * @param favoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteMemo(favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoMemoRepository.delete(
            frontUserIdModel,
            updateFavoriteVideoRequestModel.videoIdModel,
            tx);
    }

    /**
     * お気に入り動画コメントに動画を追加する
     * @param favoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async insertMemo(favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        await Promise.all(updateFavoriteVideoRequestModel.videoMemoModel.map((e, index) => {

            return favoriteVideoMemoRepository.insert(
                new FavoriteVideoMemoTransactionInsertEntity(
                    frontUserIdModel,
                    updateFavoriteVideoRequestModel.videoIdModel,
                    new VideoMemoSeqModel(index + 1),
                    e
                ), tx);
        }));
    }

}