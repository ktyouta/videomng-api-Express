import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteCommentTransactionInsertEntity } from "../../internaldata/favoritecommenttransaction/entity/FavoriteCommentTransactionInsertEntity";
import { FavoriteCommentTransactionRepositorys } from "../../internaldata/favoritecommenttransaction/repository/FavoriteCommentTransactionRepositorys";
import { FavoriteCommentTransactionRepositoryInterface } from "../../internaldata/favoritecommenttransaction/repository/interface/FavoriteCommentTransactionRepositoryInterface";
import { CreateFavoriteCommentRequestModel } from "../model/CreateFavoriteCommentRequestModel";


export class CreateFavoriteCommentService {

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
            createFavoriteCommentRequestModel.commentIdModel,
            createFavoriteCommentRequestModel.videoIdModel);

        const favoriteComment = await favoriteCommentRepository.insert(favoriteCommentInsertEntity, tx);

        return favoriteComment;
    }
}