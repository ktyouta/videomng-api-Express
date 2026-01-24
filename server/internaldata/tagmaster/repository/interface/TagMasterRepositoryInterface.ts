import { Prisma, TagMaster } from "@prisma/client";
import { TagMasterInsertEntity } from "../../entity/TagMasterInsertEntity";
import { TagMasterUpdateEntity } from "../../entity/TagMasterUpdateEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface TagMasterRepositoryInterface {

    /**
     * タグ情報を作成
     */
    insert(tagMasterInsertEntity: TagMasterInsertEntity,
        tx: Prisma.TransactionClient): Promise<TagMaster>;

    /**
     * タグ情報を更新
     */
    update(tagMasterUpdateEntity: TagMasterUpdateEntity,
        tx: Prisma.TransactionClient
    ): Promise<TagMaster>;
}