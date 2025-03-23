import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CreateBlockCommentSelectEntity } from "../entity/CreateBlockCommentSelectEntity";
import { CreateBlockCommentRequestModel } from "../model/CreateBlockCommentRequestModel";
import { CreateBlockCommentRepositorys } from "../repository/CreateBlockCommentRepositorys";
import { CreateBlockCommentRepositoryInterface } from "../repository/interface/CreateBlockCommentRepositoryInterface";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { BlockCommentTransactionRepositoryInterface } from "../../internaldata/blockcommenttransaction/repository/interface/BlockCommentTransactionRepositoryInterface";
import { BlockCommentTransactionRepositorys } from "../../internaldata/blockcommenttransaction/repository/BlockCommentTransactionRepositorys";
import { BlockCommentTransactionInsertEntity } from "../../internaldata/blockcommenttransaction/entity/BlockCommentTransactionInsertEntity";


export class CreateBlockCommentService {

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
            throw Error(`ブロックコメント登録時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * ブロックコメントの重複チェック
     * @param createBlockCommentRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkDupulicateBlockComment(createBlockCommentRequestModel: CreateBlockCommentRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // 永続ロジックを取得
        const createBlockCommentRepository: CreateBlockCommentRepositoryInterface =
            (new CreateBlockCommentRepositorys()).get(RepositoryType.POSTGRESQL);

        // ブロックコメント取得Entity
        const createBlockCommentSelectEntity = new CreateBlockCommentSelectEntity(
            frontUserIdModel, createBlockCommentRequestModel.commentIdModel);

        // ブロックコメントを取得
        const blockCommentList = await createBlockCommentRepository.select(createBlockCommentSelectEntity);

        return blockCommentList.length > 0
    }


    /**
     * ブロックコメントの永続ロジックを取得
     * @returns 
     */
    public getBlockCommentRepository(): BlockCommentTransactionRepositoryInterface {
        return (new BlockCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * ブロックコメントを追加する
     * @param blockCommentRepository 
     * @param createBlockCommentRequestModel 
     * @param frontUserIdModel 
     */
    public async insert(blockCommentRepository: BlockCommentTransactionRepositoryInterface,
        createBlockCommentRequestModel: CreateBlockCommentRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const blockCommentInsertEntity = new BlockCommentTransactionInsertEntity(
            frontUserIdModel,
            createBlockCommentRequestModel.commentIdModel);

        await blockCommentRepository.insert(blockCommentInsertEntity, tx);
    }

    /**
     * ブロックコメントを復元する
     * @param blockCommentRepository 
     * @param createBlockCommentRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async recovery(blockCommentRepository: BlockCommentTransactionRepositoryInterface,
        createBlockCommentRequestModel: CreateBlockCommentRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        await blockCommentRepository.recovery(frontUserIdModel, createBlockCommentRequestModel.commentIdModel, tx);
    }
}