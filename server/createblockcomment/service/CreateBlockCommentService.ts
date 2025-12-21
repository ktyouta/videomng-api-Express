import { Prisma } from "@prisma/client";
import { BlockCommentTransactionInsertEntity } from "../../internaldata/blockcommenttransaction/entity/BlockCommentTransactionInsertEntity";
import { BlockCommentTransactionRepositorys } from "../../internaldata/blockcommenttransaction/repository/BlockCommentTransactionRepositorys";
import { BlockCommentTransactionRepositoryInterface } from "../../internaldata/blockcommenttransaction/repository/interface/BlockCommentTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CreateBlockCommentSelectEntity } from "../entity/CreateBlockCommentSelectEntity";
import { CreateBlockCommentRequestModel } from "../model/CreateBlockCommentRequestModel";
import { CreateBlockCommentRepositorys } from "../repository/CreateBlockCommentRepositorys";
import { CreateBlockCommentRepositoryInterface } from "../repository/interface/CreateBlockCommentRepositoryInterface";


export class CreateBlockCommentService {

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
            createBlockCommentRequestModel.commentIdModel,
            createBlockCommentRequestModel.videoIdModel);

        const blockCommnet = await blockCommentRepository.insert(blockCommentInsertEntity, tx);

        return blockCommnet;
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

        const blockCommnet = await blockCommentRepository.recovery(frontUserIdModel, createBlockCommentRequestModel.commentIdModel, tx);

        return blockCommnet;
    }
}