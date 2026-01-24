import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoCategoryTransactionInsertEntity } from "../../entity/FavoriteVideoCategoryTransactionInsertEntity";
import { FavoriteVideoCategoryTransactionUpdateEntity } from "../../entity/FavoriteVideoCategoryTransactionUpdateEntity";
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
}