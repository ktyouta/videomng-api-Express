import { Prisma } from "@prisma/client";
import { FLG } from "../../../../common/const/CommonConst";
import { FrontUserIdModel } from "../../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../common/properties/VideoIdModel";
import { FavoriteVideoMemoTransactionInsertEntity } from "../../entity/FavoriteVideoMemoTransactionInsertEntity";
import { FavoriteVideoMemoTransactionSoftDeleteEntity } from "../../entity/FavoriteVideoMemoTransactionSoftDeleteEntity";
import { FavoriteVideoMemoTransactionUpdateEntity } from "../../entity/FavoriteVideoMemoTransactionUpdateEntity";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../interface/FavoriteVideoMemoTransactionRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteVideoMemoTransactionRepositoryPostgres implements FavoriteVideoMemoTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * お気に入り動画メモ情報を作成
     */
    async insert(favoriteVideoMemoTransactionInsertEntity: FavoriteVideoMemoTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoMemoTransactionInsertEntity.frontUserId;
        const videoId = favoriteVideoMemoTransactionInsertEntity.videoId;
        const videoMemoSeq = favoriteVideoMemoTransactionInsertEntity.videoMemoSeq;
        const videoMemo = favoriteVideoMemoTransactionInsertEntity.videoMemo;

        const favoriteVideoMemo = await tx.favoriteVideoMemoTransaction.create({
            data: {
                userId,
                videoId,
                videoMemoSeq,
                videoMemo,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteVideoMemo;
    }


    /**
     * お気に入り動画メモ情報を更新
     */
    async update(favoriteVideoMemoTransactionUpdateEntity: FavoriteVideoMemoTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoMemoTransactionUpdateEntity.frontUserId;
        const videoId = favoriteVideoMemoTransactionUpdateEntity.videoId;
        const videoMemoSeq = favoriteVideoMemoTransactionUpdateEntity.videoMemoSeq;
        const videoMemo = favoriteVideoMemoTransactionUpdateEntity.videoMemo;

        const favoriteVideoMemo = await tx.favoriteVideoMemoTransaction.update({
            where: {
                userId_videoId_videoMemoSeq: {
                    userId,
                    videoId,
                    videoMemoSeq,
                },
            },
            data: {
                videoMemo,
                updateDate: new Date(),
            },
        });

        return favoriteVideoMemo;
    }


    /**
     * お気に入り動画メモ情報を削除
     */
    async delete(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        await tx.favoriteVideoMemoTransaction.deleteMany({
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

        const favoriteVideoMemo = await tx.favoriteVideoMemoTransaction.updateMany({
            where: {
                userId,
                videoId,
            },
            data: {
                deleteFlg: FLG.OFF,
                updateDate: new Date(),
            },
        });

        return favoriteVideoMemo;
    }


    /**
     * 対象ユーザーのお気に入り動画メモ情報を削除
     */
    async deleteUserMemo(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideoMemo = await tx.favoriteVideoMemoTransaction.deleteMany({
            where: {
                userId,
                videoId,
            }
        });

        return favoriteVideoMemo;
    }


    /**
     * お気に入り動画メモ情報を論理削除
     */
    async softDelete(favoriteVideoMemoTransactionSoftDeleteEntity: FavoriteVideoMemoTransactionSoftDeleteEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoMemoTransactionSoftDeleteEntity.frontUserId;
        const videoId = favoriteVideoMemoTransactionSoftDeleteEntity.videoId;
        const videoMemoSeq = favoriteVideoMemoTransactionSoftDeleteEntity.videoMemoSeq;

        const favoriteVideoMemo = await tx.favoriteVideoMemoTransaction.update({
            where: {
                userId_videoId_videoMemoSeq: {
                    userId,
                    videoId,
                    videoMemoSeq,
                },
            },
            data: {
                deleteFlg: FLG.ON,
                updateDate: new Date(),
            },
        });

        return favoriteVideoMemo;
    }
}