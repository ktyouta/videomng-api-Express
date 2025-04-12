import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { TagMasterRepositoryInterface } from "../interface/TagMasterRepositoryInterface";
import { TagMasterInsertEntity } from "../../entity/TagMasterInsertEntity";
import { TagMasterUpdateEntity } from "../../entity/TagMasterUpdateEntity";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { TagMasterSoftDeleteEntity } from "../../entity/TagMasterSoftDeleteEntity";



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

        const tag = await tx.tagMaster.create({
            data: {
                userId,
                tagId,
                tagName,
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
        const tagName = tagMasterUpdateEntity.tagName;

        const tag = await tx.tagMaster.update({
            where: {
                userId_tagId: {
                    userId,
                    tagId,
                },
            },
            data: {
                tagName,
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
        const tagName = tagMasterSoftDeleteEntity.tagName;

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