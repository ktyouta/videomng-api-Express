import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFavoriteVideoInterface } from "../interface/DeleteFavoriteVideoInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class DeleteFavoriteVideoRepositoryPostgres implements DeleteFavoriteVideoInterface {

    constructor() {
    }

    /**
     * お気に入り動画フォルダから削除
     */
    async deleteFavoriteVideoFolder(insertEntity: DeleteFavoriteVideoFolderEntity,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const userId = insertEntity.frontUserId;
        const videoId = insertEntity.videoId;

        const result = await tx.favoriteVideoFolderTransaction.deleteMany({
            where: {
                userId,
                videoId,
            },
        });

        return result;
    };

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