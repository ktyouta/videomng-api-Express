import { Prisma } from "@prisma/client";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideocommenttransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideocommenttransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../internaldata/favoritevideocommenttransaction/entity/FavoriteVideoMemoTransactionInsertEntity";
import { VideoMemoModel } from "../../internaldata/favoritevideocommenttransaction/properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideocommenttransaction/properties/VideoMemoSeqModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';


export class DeleteFavoriteVideoService {

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
     * お気に入り動画を削除する
     * @param favoriteVideoRepository 
     * @param deleteFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteVideo(favoriteVideoRepository: FavoriteVideoTransactionRepositoryInterface,
        videoId: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのお気に入り動画を全て論理削除する
        await favoriteVideoRepository.softDelete(
            frontUserIdModel,
            videoId,
            tx);
    }

    /**
     * お気に入り動画コメントに動画を追加する
     * @param favoriteVideoRepository 
     * @param deleteFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async deleteMemo(favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        videoId: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoMemoRepository.delete(
            frontUserIdModel,
            videoId,
            tx);
    }

}