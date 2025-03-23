import { JsonFileData } from "../../../util/service/JsonFileData";
import { CreateBlockCommentSelectEntity } from "../../entity/CreateBlockCommentSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { CreateBlockCommentRepositoryInterface } from "../interface/CreateBlockCommentRepositoryInterface";
import { BlockCommentTransaction } from "@prisma/client";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateBlockCommentRepositoryPostgres implements CreateBlockCommentRepositoryInterface {

    constructor() {
    }


    /**
     * ブロックコメント情報取得
     * @param frontBlockCommentInfoMasterModel 
     * @returns 
     */
    public async select(createBlockCommentSelectEntity: CreateBlockCommentSelectEntity): Promise<BlockCommentTransaction[]> {

        const userId = createBlockCommentSelectEntity.frontUserId;
        const commentId = createBlockCommentSelectEntity.commentId;

        const blockCommentList = await PrismaClientInstance.getInstance().$queryRaw<BlockCommentTransaction[]>`
            SELECT * 
            FROM "block_commnet_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            comment_id = ${commentId}
        `;

        return blockCommentList;
    }

}