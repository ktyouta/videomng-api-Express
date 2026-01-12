import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { TagMasterInsertEntity } from "../../entity/TagMasterInsertEntity";
import { TagMasterSoftDeleteEntity } from "../../entity/TagMasterSoftDeleteEntity";
import { TagMasterUpdateEntity } from "../../entity/TagMasterUpdateEntity";
import { TagMasterRepositoryInterface } from "../interface/TagMasterRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class TagMasterRepositoryPostgres implements TagMasterRepositoryInterface {


    constructor() {

    }

    /**
     * タグ情報を作成
     */
    async insert(tagMasterInsertEntity: TagMasterInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = tagMasterInsertEntity.frontUserId;
        const tagId = tagMasterInsertEntity.tagId;
        const tagName = tagMasterInsertEntity.tagName;
        const tagColor = tagMasterInsertEntity.tagColor;

        const tag = await tx.tagMaster.create({
            data: {
                userId,
                tagId,
                tagName,
                tagColor,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return tag;
    }


    /**
     * タグ情報を更新
     */
    async update(tagMasterUpdateEntity: TagMasterUpdateEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = tagMasterUpdateEntity.frontUserId;
        const tagId = tagMasterUpdateEntity.tagId;
        const tagColor = tagMasterUpdateEntity.tagColor;

        const tag = await tx.tagMaster.update({
            where: {
                userId_tagId: {
                    userId,
                    tagId,
                },
            },
            data: {
                tagColor,
                updateDate: new Date(),
            },
        });

        return tag;
    }


    /**
     * タグ情報を論理削除
     */
    async softDelete(tagMasterSoftDeleteEntity: TagMasterSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = tagMasterSoftDeleteEntity.frontUserId;
        const tagId = tagMasterSoftDeleteEntity.tagId;

        const tag = await tx.tagMaster.update({
            where: {
                userId_tagId: {
                    userId,
                    tagId,
                },
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return tag;
    }
}