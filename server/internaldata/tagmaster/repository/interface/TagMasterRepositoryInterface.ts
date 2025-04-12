import { TagMaster, Prisma } from "@prisma/client";
import { TagMasterInsertEntity } from "../../entity/TagMasterInsertEntity";
import { TagMasterUpdateEntity } from "../../entity/TagMasterUpdateEntity";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { TagMasterSoftDeleteEntity } from "../../entity/TagMasterSoftDeleteEntity";


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

    /**
     * タグ情報を論理削除
     */
    softDelete(tagMasterSoftDeleteEntity: TagMasterSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ): Promise<TagMaster>;
}

