import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { FLG } from "../../../util/const/CommonConst";
import { DeleteFavoriteVideoInterface } from "../interface/DeleteFavoriteVideoInterface";
import { DeleteFavoriteVideoEntity } from "../../../deletefolder/entity/DeleteFavoriteVideoEntity";
import { Prisma } from "@prisma/client";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";



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
}