import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { BlockCommentTransactionRepositoryInterface } from "../../internaldata/blockcommenttransaction/repository/interface/BlockCommentTransactionRepositoryInterface";
import { CommentIdModel } from "../../internaldata/blockcommenttransaction/properties/CommentIdModel";
import { BlockCommentTransactionRepositorys } from "../../internaldata/blockcommenttransaction/repository/BlockCommentTransactionRepositorys";


export class DeleteBlockCommentService {

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
            throw Error(`ブロックコメント削除時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getBlockCommentRepository(): BlockCommentTransactionRepositoryInterface {
        return (new BlockCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * ブロックコメントを削除する
     * @param blockCommentRepository 
     * @param deleteBlockCommentRequestModel 
     * @param frontUserIdModel 
     */
    public async softDelete(blockCommentRepository: BlockCommentTransactionRepositoryInterface,
        commentIdModel: CommentIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // ブロックコメント削除
        const blockComment = await blockCommentRepository.softDelete(frontUserIdModel, commentIdModel, tx);

        return blockComment;
    }

}