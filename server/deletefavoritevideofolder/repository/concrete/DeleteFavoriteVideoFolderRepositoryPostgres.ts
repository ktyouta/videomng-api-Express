import { Prisma } from "@prisma/client";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFavoriteVideoFolderInterface } from "../interface/DeleteFavoriteVideoFolderInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class DeleteFavoriteVideoFolderRepositoryPostgres implements DeleteFavoriteVideoFolderInterface {

    constructor() {
    }

    /**
     * お気に入り動画フォルダから削除
     */
    async delete(insertFolderEntity: DeleteFavoriteVideoFolderEntity,
        tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {

        const userId = insertFolderEntity.frontUserId;
        const folderId = insertFolderEntity.folderId;
        const videoId = insertFolderEntity.videoId;

        const result = await tx.favoriteVideoFolderTransaction.deleteMany({
            where: {
                folderMasterId: folderId,
                videoId,
                folderMaster: {
                    userId
                }
            },
        });

        return result;
    };
}