import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoTagTransactionInsertEntity } from "../../entity/FavoriteVideoTagTransactionInsertEntity";
import { FavoriteVideoTagTransactionRepositoryInterface } from "../interface/FavoriteVideoTagTransactionRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteVideoTagTransactionRepositoryPostgres implements FavoriteVideoTagTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * お気に入り動画タグを作成
     */
    async insert(favoriteVideoTagTransactionInsertEntity: FavoriteVideoTagTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoTagTransactionInsertEntity.frontUserId;
        const videoId = favoriteVideoTagTransactionInsertEntity.videoId;
        const tagId = favoriteVideoTagTransactionInsertEntity.tagId;

        const favoriteVideoTag = await tx.favoriteVideoTagTransaction.create({
            data: {
                userId,
                videoId,
                tagId,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteVideoTag;
    }


    /**
     * お気に入り動画タグを削除
     */
    async delete(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        await tx.favoriteVideoTagTransaction.deleteMany({
            where: {
                userId,
                videoId,
            }
        });
    }
}