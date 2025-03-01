import { Prisma } from "@prisma/client";
import { FLG } from "../../../../util/const/CommonConst";
import { PrismaClientInstance } from "../../../../util/service/PrismaClientInstance";
import { FrontUserIdModel } from "../../../frontuserinfomaster/properties/FrontUserIdModel";
import { FavoriteVideoCommentTransactionRepositoryInterface } from "../interface/FavoriteVideoTransactionRepositoryInterface";
import { FavoriteVideoCommentTransactionInsertEntity } from "../../entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoCommentTransactionUpdateEntity } from "../../entity/FavoriteVideoTransactionUpdateEntity";
import { VideoIdModel } from "../../../favoritevideotransaction/properties/VideoIdModel";
import { VideoCommentSeqModel } from "../../properties/VideoCommentSeqModel";



/**
 * json形式の永続ロジック用クラス
 */
export class FavoriteVideoCommentTransactionRepositoryPostgres implements FavoriteVideoCommentTransactionRepositoryInterface {


    constructor() {

    }

    /**
     * お気に入り動画コメント情報を作成
     */
    async insert(favoriteVideoCommentTransactionInsertEntity: FavoriteVideoCommentTransactionInsertEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoCommentTransactionInsertEntity.frontUserId;
        const videoId = favoriteVideoCommentTransactionInsertEntity.videoId;
        const videoCommentSeq = favoriteVideoCommentTransactionInsertEntity.videoCommentSeq;
        const videoComment = favoriteVideoCommentTransactionInsertEntity.videoComment;

        const favoriteVideoComment = await tx.favoriteVideoCommentTransaction.create({
            data: {
                userId,
                videoId,
                videoCommentSeq,
                videoComment,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteVideoComment;
    }


    /**
     * お気に入り動画コメント情報を更新
     */
    async update(favoriteVideoCommentTransactionUpdateEntity: FavoriteVideoCommentTransactionUpdateEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = favoriteVideoCommentTransactionUpdateEntity.frontUserId;
        const videoId = favoriteVideoCommentTransactionUpdateEntity.videoId;
        const videoCommentSeq = favoriteVideoCommentTransactionUpdateEntity.videoCommentSeq;
        const videoComment = favoriteVideoCommentTransactionUpdateEntity.videoComment;

        const favoriteVideoComment = await tx.favoriteVideoCommentTransaction.update({
            where: {
                userId_videoId_videoCommentSeq: {
                    userId,
                    videoId,
                    videoCommentSeq,
                },
            },
            data: {
                videoComment,
                updateDate: new Date(),
            },
        });

        return favoriteVideoComment;
    }


    /**
     * お気に入り動画コメント情報を削除
     */
    async delete(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        await tx.favoriteVideoCommentTransaction.deleteMany({
            where: {
                userId,
                videoId,
            }
        });
    }


    /**
     * 削除コメントの復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;

        const favoriteVideoComment = await tx.favoriteVideoCommentTransaction.updateMany({
            where: {
                userId,
                videoId,
            },
            data: {
                deleteFlg: FLG.OFF,
                updateDate: new Date(),
            },
        });

        return favoriteVideoComment;
    }
}