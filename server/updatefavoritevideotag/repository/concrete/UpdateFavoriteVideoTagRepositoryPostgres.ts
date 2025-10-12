import { FavoriteVideoTagTransaction, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { UpdateFavoriteVideoTagFavoriteVideoSelectEntity } from "../../entity/UpdateFavoriteVideoTagFavoriteVideoSelectEntity";
import { UpdateFavoriteVideoTagRepositoryInterface } from "../interface/UpdateFavoriteVideoTagRepositoryInterface";
import { UpdateFavoriteVideoTagNextSeqType } from "../../type/UpdateFavoriteVideoTagNextSeqType";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFavoriteVideoTagRepositoryPostgres implements UpdateFavoriteVideoTagRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    public async selectFavoriteVideo(updateFavoriteVideoTagSelectEntity: UpdateFavoriteVideoTagFavoriteVideoSelectEntity): Promise<FavoriteVideoTagTransaction[]> {

        const userId = updateFavoriteVideoTagSelectEntity.frontUserId;
        const videoId = updateFavoriteVideoTagSelectEntity.videoId;

        const favoriteVideoTagList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTagTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoTagList;
    }


    /**
     * タグマスタのシーケンス番号取得
     * @param createFavoriteVideoMemoSeqSelectEntity 
     * @returns 
     */
    public async selectTagSeq(frontUserIdModel: FrontUserIdModel)
        : Promise<UpdateFavoriteVideoTagNextSeqType[]> {

        const userId = frontUserIdModel.frontUserId;

        const seqList = await PrismaClientInstance.getInstance().$queryRaw<UpdateFavoriteVideoTagNextSeqType[]>`
                SELECT COALESCE(MAX(tag_id), 0) + 1 as "nextSeq"
                FROM "tag_master" 
                WHERE user_id = CAST(${userId} AS INTEGER)
            `;

        return seqList;
    }


    /**
     * タグマスタ取得
     * @param createFavoriteVideoMemoSeqSelectEntity 
     * @returns 
     */
    public async selectTagMaster(tagNameModel: TagNameModel, userIdModel: FrontUserIdModel)
        : Promise<TagMaster[]> {

        const tagName = tagNameModel.tagName;
        const userId = userIdModel.frontUserId;

        const tagList = await PrismaClientInstance.getInstance().$queryRaw<TagMaster[]>`
                SELECT 
                    tag_name as "tagName",
                    tag_id as "tagId"
                FROM 
                    "tag_master" 
                WHERE 
                    tag_name = ${tagName} AND
                    user_id = ${userId}
            `;

        return tagList;
    }


    /**
     * タグマスタ削除
     * @param createFavoriteVideoMemoSeqSelectEntity 
     * @returns 
     */
    public async deleteTagMaster(frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient)
        : Promise<void> {

        const frontUserId = frontUserIdModel.frontUserId;

        await tx.$queryRaw`
                DELETE FROM 
                    tag_master a
                WHERE 
                    user_id = ${frontUserId} AND
                NOT EXISTS(
                    SELECT 
                        1
                    FROM
                        favorite_video_tag_transaction b
                    WHERE
                        b.user_id = ${frontUserId} AND
                        b.tag_id = a.tag_id
                )
            `;
    }
}