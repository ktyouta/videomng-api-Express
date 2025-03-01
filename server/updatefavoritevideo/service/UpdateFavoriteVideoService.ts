import { Prisma } from "@prisma/client";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoRequestModel } from "../model/UpdateFavoriteVideoRequestModel";
import { FavoriteVideoCommentTransactionRepositoryInterface } from "../../internaldata/favoritevideocommenttransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FavoriteVideoCommentTransactionRepositorys } from "../../internaldata/favoritevideocommenttransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoCommentTransactionInsertEntity } from "../../internaldata/favoritevideocommenttransaction/entity/FavoriteVideoTransactionInsertEntity";
import { VideoCommentModel } from "../../internaldata/favoritevideocommenttransaction/properties/VideoCommentModel";
import { VideoCommentSeqModel } from "../../internaldata/favoritevideocommenttransaction/properties/VideoCommentSeqModel";


export class UpdateFavoriteVideoService {

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(jwt: string) {

        try {
            const jsonWebTokenVerifyModel = JsonWebTokenUserModel.get(jwt);

            return jsonWebTokenVerifyModel;
        } catch (err) {
            throw Error(`お気に入り動画更新時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画コメントの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoCommentRepository(): FavoriteVideoCommentTransactionRepositoryInterface {
        return (new FavoriteVideoCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画コメントを削除する
     * @param favoriteVideoRepository 
     * @param updateFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteComment(favoriteVideoCommentRepository: FavoriteVideoCommentTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoCommentRepository.delete(
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
    public async insertComment(favoriteVideoCommentRepository: FavoriteVideoCommentTransactionRepositoryInterface,
        updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        await Promise.all(updateFavoriteVideoRequestModel.videoCommentModel.map((e, index) => {

            return favoriteVideoCommentRepository.insert(
                new FavoriteVideoCommentTransactionInsertEntity(
                    frontUserIdModel,
                    updateFavoriteVideoRequestModel.videoIdModel,
                    new VideoCommentSeqModel(index + 1),
                    e
                ), tx);
        }));
    }

}