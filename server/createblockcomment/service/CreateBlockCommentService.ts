import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { BlockCommentTransactionInsertEntity } from "../../internaldata/blockcommenttransaction/entity/BlockCommentTransactionInsertEntity";
import { BlockCommentTransactionRepositorys } from "../../internaldata/blockcommenttransaction/repository/BlockCommentTransactionRepositorys";
import { BlockCommentTransactionRepositoryInterface } from "../../internaldata/blockcommenttransaction/repository/interface/BlockCommentTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { CreateBlockCommentRequestModel } from "../model/CreateBlockCommentRequestModel";


export class CreateBlockCommentService {

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