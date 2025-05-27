import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FavoriteVideoTransactionInsertEntity } from "../../entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionUpdateEntity } from "../../entity/FavoriteVideoTransactionUpdateEntity";
import { FavoriteVideoTransactionRepositoryInterface } from "../interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteVideoTransactionRepositoryPostgres implements FavoriteVideoTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * お気に入り動画情報を作成
     */
    async insert(favoriteVideoTransactionInsertEntity: FavoriteVideoTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoTransactionInsertEntity.frontUserId;
        const videoId = favoriteVideoTransactionInsertEntity.videoId;
        const viewStatus = favoriteVideoTransactionInsertEntity.viewStatus;

        const favoriteVideo = await tx.favoriteVideoTransaction.create({
            data: {
                userId,
                videoId,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
                viewStatus: viewStatus,
            },
        });

        return favoriteVideo;
    }


    /**
     * お気に入り動画情報を更新
     */
    async update(favoriteVideoTransactionUpdateEntity: FavoriteVideoTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoTransactionUpdateEntity.frontUserId;
        const videoId = favoriteVideoTransactionUpdateEntity.videoId;
        const summary = favoriteVideoTransactionUpdateEntity.summary;
        const viewStatus = favoriteVideoTransactionUpdateEntity.viewStatus;
        const favoriteLevel = favoriteVideoTransactionUpdateEntity.favoriteLevel;

        const favoriteVideo = await tx.favoriteVideoTransaction.update({
            where: {
                userId_videoId: {
                    userId,
                    videoId,
                }
            },
            data: {
                summary,
                viewStatus,
                updateDate: new Date(),
                favoriteLevel,
            },
        });

        return favoriteVideo;
    }


    /**
     * 削除動画の復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideo = await tx.favoriteVideoTransaction.update({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            },
            data: {
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteVideo;
    }


    /**
     * お気に入り動画を論理削除
     */
    async softDelete(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideo = await tx.favoriteVideoTransaction.update({
            where: {
                userId_videoId: {
                    userId,
                    videoId
                }
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteVideo;
    }
}