import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { CreateFavoriteCommentRequestModel } from "../model/CreateFavoriteCommentRequestModel";
import { CreateFavoriteCommentRepositoryInterface } from "../repository/interface/CreateFavoriteCommentRepositoryInterface";
import { CreateFavoriteCommentRepositorys } from "../repository/CreateFavoriteCommentRepositorys";
import { CreateFavoriteCommentSelectEntity } from "../entity/CreateFavoriteCommentSelectEntity";
import { FavoriteCommentTransactionRepositoryInterface } from "../../internaldata/favoritecommenttransaction/repository/interface/FavoriteCommentTransactionRepositoryInterface";
import { FavoriteCommentTransactionRepositorys } from "../../internaldata/favoritecommenttransaction/repository/FavoriteCommentTransactionRepositorys";
import { FavoriteCommentTransactionInsertEntity } from "../../internaldata/favoritecommenttransaction/entity/FavoriteCommentTransactionInsertEntity";


export class CreateFavoriteCommentService {

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
            throw Error(`お気に入りコメント登録時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入りコメントの重複チェック
     * @param createFavoriteCommentRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkDupulicateFavoriteComment(createFavoriteCommentRequestModel: CreateFavoriteCommentRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // 永続ロジックを取得
        const createFavoriteCommentRepository: CreateFavoriteCommentRepositoryInterface =
            (new CreateFavoriteCommentRepositorys()).get(RepositoryType.POSTGRESQL);

        // お気に入りコメント取得Entity
        const createFavoriteCommentSelectEntity = new CreateFavoriteCommentSelectEntity(
            frontUserIdModel, createFavoriteCommentRequestModel.commentIdModel);

        // お気に入りコメントを取得
        const favoriteCommentList = await createFavoriteCommentRepository.select(createFavoriteCommentSelectEntity);

        return favoriteCommentList.length > 0
    }


    /**
     * お気に入りコメントの永続ロジックを取得
     * @returns 
     */
    public getFavoriteCommentRepository(): FavoriteCommentTransactionRepositoryInterface {
        return (new FavoriteCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入りコメントを追加する
     * @param favoriteCommentRepository 
     * @param createFavoriteCommentRequestModel 
     * @param frontUserIdModel 
     */
    public async insert(favoriteCommentRepository: FavoriteCommentTransactionRepositoryInterface,
        createFavoriteCommentRequestModel: CreateFavoriteCommentRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteCommentInsertEntity = new FavoriteCommentTransactionInsertEntity(
            frontUserIdModel,
            createFavoriteCommentRequestModel.commentIdModel);

        const favoriteComment = await favoriteCommentRepository.insert(favoriteCommentInsertEntity, tx);

        return favoriteComment;
    }

    /**
     * お気に入りコメントを復元する
     * @param favoriteCommentRepository 
     * @param createFavoriteCommentRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async recovery(favoriteCommentRepository: FavoriteCommentTransactionRepositoryInterface,
        createFavoriteCommentRequestModel: CreateFavoriteCommentRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteComment = await favoriteCommentRepository.recovery(frontUserIdModel, createFavoriteCommentRequestModel.commentIdModel, tx);

        return favoriteComment;
    }
}