import { BlockCommentTransaction } from "@prisma/client";
import { CreateBlockCommentSelectEntity } from "../../entity/CreateBlockCommentSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateBlockCommentRepositoryInterface {

    /**
     * ブロックコメント情報取得
     * @param blockCommentInsertEntity 
     */
    select(createBlockCommentSelectEntity: CreateBlockCommentSelectEntity): Promise<BlockCommentTransaction[]>;
}