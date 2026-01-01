import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FavoriteCommentTransactionRepositorys } from "../../internaldata/favoritecommenttransaction/repository/FavoriteCommentTransactionRepositorys";
import { FavoriteCommentTransactionRepositoryInterface } from "../../internaldata/favoritecommenttransaction/repository/interface/FavoriteCommentTransactionRepositoryInterface";


export class DeleteFavoriteCommentService {

    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getFavoriteCommentRepository(): FavoriteCommentTransactionRepositoryInterface {
        return (new FavoriteCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入りコメントを削除する
     * @param favoriteCommentRepository 
     * @param deleteFavoriteCommentRequestModel 
     * @param frontUserIdModel 
     */
    public async softDelete(favoriteCommentRepository: FavoriteCommentTransactionRepositoryInterface,
        commentIdModel: CommentIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // お気に入りコメント削除
        const favoriteComment = await favoriteCommentRepository.softDelete(frontUserIdModel, commentIdModel, tx);

        return favoriteComment;
    }

}