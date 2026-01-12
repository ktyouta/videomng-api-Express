import { TagMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetTagListSelectEntity } from "../../entity/GetTagListSelectEntity";
import { GetTagListRepositoryInterface } from "../interface/GetTagListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetTagListRepositoryPostgres implements GetTagListRepositoryInterface {

    constructor() {
    }

    /**
     * タグ取得
     * @returns 
     */
    async selectTag(getTagListSelectEntity: GetTagListSelectEntity): Promise<TagMaster[]> {

        const frontUserId = getTagListSelectEntity.frontUserId;

        const tagList = await PrismaClientInstance.getInstance().$queryRaw<TagMaster[]>`
            SELECT 
                user_id as "userId",
                tag_id as "tagId",
                tag_name as "tagName",
                tag_color as "tagColor",
                create_date as "createDate",
                update_date as "updateDate"
            FROM "tag_master" 
            WHERE user_id = ${frontUserId} AND
            delete_flg = '0'
            `;

        return tagList;
    }
}