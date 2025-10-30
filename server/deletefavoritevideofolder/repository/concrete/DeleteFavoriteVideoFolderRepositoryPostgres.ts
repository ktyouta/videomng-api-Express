import { FavoriteVideoFolderTransaction, FavoriteVideoTagTransaction, FavoriteVideoTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { FLG } from "../../../util/const/CommonConst";
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
                userId,
                folderId,
                videoId,
            },
        });

        return result;
    };
}