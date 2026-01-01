import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoTagTransactionInsertEntity } from "../../entity/FavoriteVideoTagTransactionInsertEntity";
import { FavoriteVideoTagTransactionSoftDeleteEntity } from "../../entity/FavoriteVideoTagTransactionSoftDeleteEntity";
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


    /**
     * 削除タグの復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideoTag = await tx.favoriteVideoTagTransaction.updateMany({
            where: {
                userId,
                videoId,
            },
            data: {
                deleteFlg: FLG.OFF,
                updateDate: new Date(),
            },
        });

        return favoriteVideoTag;
    }


    /**
     * 対象ユーザーのお気に入り動画タグを論理削除
     */
    async softDeleteUserTag(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideoTag = await tx.favoriteVideoTagTransaction.updateMany({
            where: {
                userId,
                videoId,
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteVideoTag;
    }


    /**
     * お気に入り動画タグを論理削除
     */
    async softDelete(favoriteVideoTagTransactionSoftDeleteEntity: FavoriteVideoTagTransactionSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoTagTransactionSoftDeleteEntity.frontUserId;
        const videoId = favoriteVideoTagTransactionSoftDeleteEntity.videoId;
        const tagId = favoriteVideoTagTransactionSoftDeleteEntity.tagId;

        const favoriteVideoTag = await tx.favoriteVideoTagTransaction.update({
            where: {
                userId_videoId_tagId: {
                    userId,
                    videoId,
                    tagId,
                },
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteVideoTag;
    }
}