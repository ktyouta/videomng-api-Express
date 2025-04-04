import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { FavoriteVideoCategoryTransactionInsertEntity } from "../../entity/FavoriteVideoCategoryTransactionInsertEntity";
import { FavoriteVideoCategoryTransactionUpdateEntity } from "../../entity/FavoriteVideoCategoryTransactionUpdateEntity";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoCategoryTransactionSoftDeleteEntity } from "../../entity/FavoriteVideoCategoryTransactionSoftDeleteEntity";
import { FavoriteVideoCategoryTransactionRepositoryInterface } from "../interface/FavoriteVideoCategoryTransactionRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteVideoCategoryTransactionRepositoryPostgres implements FavoriteVideoCategoryTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * お気に入り動画カテゴリを作成
     */
    async insert(favoriteVideoCategoryTransactionInsertEntity: FavoriteVideoCategoryTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoCategoryTransactionInsertEntity.frontUserId;
        const videoId = favoriteVideoCategoryTransactionInsertEntity.videoId;
        const categoryId = favoriteVideoCategoryTransactionInsertEntity.categoryId;

        const favoriteVideoCategory = await tx.favoriteVideoCategoryTransaction.create({
            data: {
                userId,
                videoId,
                categoryId,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteVideoCategory;
    }


    /**
     * お気に入り動画カテゴリを更新
     */
    async update(favoriteVideoCategoryTransactionUpdateEntity: FavoriteVideoCategoryTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoCategoryTransactionUpdateEntity.frontUserId;
        const videoId = favoriteVideoCategoryTransactionUpdateEntity.videoId;
        const categoryId = favoriteVideoCategoryTransactionUpdateEntity.categoryId;

        const favoriteVideoCategory = await tx.favoriteVideoCategoryTransaction.update({
            where: {
                userId_videoId_categoryId: {
                    userId,
                    videoId,
                    categoryId,
                },
            },
            data: {
                categoryId,
                updateDate: new Date(),
            },
        });

        return favoriteVideoCategory;
    }


    /**
     * お気に入り動画カテゴリを削除
     */
    async delete(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        await tx.favoriteVideoCategoryTransaction.deleteMany({
            where: {
                userId,
                videoId,
            }
        });
    }


    /**
     * 削除メモの復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideoCategory = await tx.favoriteVideoCategoryTransaction.updateMany({
            where: {
                userId,
                videoId,
            },
            data: {
                deleteFlg: FLG.OFF,
                updateDate: new Date(),
            },
        });

        return favoriteVideoCategory;
    }


    /**
     * 対象ユーザーのお気に入り動画カテゴリを論理削除
     */
    async softDeleteUserCategory(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideoCategory = await tx.favoriteVideoCategoryTransaction.updateMany({
            where: {
                userId,
                videoId,
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteVideoCategory;
    }


    /**
     * お気に入り動画カテゴリを論理削除
     */
    async softDelete(favoriteVideoCategoryTransactionSoftDeleteEntity: FavoriteVideoCategoryTransactionSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoCategoryTransactionSoftDeleteEntity.frontUserId;
        const videoId = favoriteVideoCategoryTransactionSoftDeleteEntity.videoId;
        const categoryId = favoriteVideoCategoryTransactionSoftDeleteEntity.categoryId;

        const favoriteVideoCategory = await tx.favoriteVideoCategoryTransaction.update({
            where: {
                userId_videoId_categoryId: {
                    userId,
                    videoId,
                    categoryId,
                },
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteVideoCategory;
    }
}