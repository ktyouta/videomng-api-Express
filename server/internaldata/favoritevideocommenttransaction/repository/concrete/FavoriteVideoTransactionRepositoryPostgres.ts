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
     * お気に入り動画情報を作成
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
     * お気に入り動画情報を更新
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
     * 削除動画の復元
     */
    async recovery(userIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        videoCommentSeqModel: VideoCommentSeqModel,
        tx: Prisma.TransactionClient) {

        const userId = userIdModel.frontUserId;
        const videoId = videoIdModel.videoId;
        const videoCommentSeq = videoCommentSeqModel.videoCommentSeq;

        const seqData = await tx.favoriteVideoCommentTransaction.update({
            where: {
                userId_videoId_videoCommentSeq: {
                    userId,
                    videoId,
                    videoCommentSeq,
                },
            },
            data: {
                deleteFlg: FLG.OFF,
            },
        });

        return seqData;
    }
}