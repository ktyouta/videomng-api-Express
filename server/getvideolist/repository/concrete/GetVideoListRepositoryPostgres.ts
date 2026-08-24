import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SEARCH_WORD_RETENTION_LIMIT } from "../../const/GetVideoListConst";
import { CreateSearchWordEntity } from "../../entity/CreateSearchWordEntity";
import { GetVideoListSelectEntity } from "../../entity/GetVideoListSelectEntity";
import { GetVideoListRepositoryInterface } from "../interface/GetVideoListRepositoryInterface";

/**
 * 永続ロジック用クラス
 */
export class GetVideoListRepositoryPostgres implements GetVideoListRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画取得
     * @returns 
     */
    async selectVideo(getVideoListSelectEntity: GetVideoListSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const frontUserId = getVideoListSelectEntity.frontUserId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT 
                video_id as "videoId"
            FROM 
                "favorite_video_transaction" a
            WHERE 
                a.user_id = CAST(${frontUserId} AS INTEGER) AND
                a.delete_flg = '0'
            `;

        return favoriteVideoList;
    }

    /**
     * 最近の検索実績登録（既に存在する場合は何もしない）
     * @param entity
     * @param tx
     */
    async insertRecentSearchWord(entity: CreateSearchWordEntity, tx: Prisma.TransactionClient): Promise<void> {

        const now = new Date();

        // 存在すれば update_date を更新、なければ実績を作成する。
        await tx.recentSearchWordTransaction.upsert({
            where: {
                userId_word: {
                    userId: entity.frontUserId,
                    word: entity.word,
                },
            },
            update: {
                updateDate: now,
            },
            create: {
                userId: entity.frontUserId,
                word: entity.word,
                createDate: now,
                updateDate: now,
            },
        });
    };

    /**
     * あなたがよく検索するワード登録（存在すれば検索回数を加算、なければ新規登録）
     * @param entity
     * @param tx
     */
    async upsertFrequentSearchWord(entity: CreateSearchWordEntity, tx: Prisma.TransactionClient): Promise<void> {

        const now = new Date();

        // (user_id, word) の一意制約を利用したアトミックな upsert。
        // 存在すれば search_count を +1、なければ search_count = 1 で新規作成する。
        await tx.frequentSearchWordTransaction.upsert({
            where: {
                userId_word: {
                    userId: entity.frontUserId,
                    word: entity.word,
                },
            },
            update: {
                searchCount: { increment: 1 },
                updateDate: now,
            },
            create: {
                userId: entity.frontUserId,
                word: entity.word,
                searchCount: 1,
                createDate: now,
                updateDate: now,
            },
        });
    };

    /**
     * 保持上限を超えた検索実績を削除する（LRU）
     * update_date の新しい上位 SEARCH_WORD_RETENTION_LIMIT 件を残し、それ以外を削除する。
     * @param frontUserIdModel
     * @param tx
     */
    async deleteExcessRecentSearchWord(frontUserIdModel: FrontUserIdModel, tx: Prisma.TransactionClient): Promise<void> {

        const userId = frontUserIdModel.frontUserId;

        // update_date が同値の場合に備え id の降順を第2キーにして境界を一意にする。
        await tx.$executeRaw`
            DELETE FROM recent_search_word_transaction
            WHERE user_id = ${userId}
              AND id NOT IN (
                SELECT id
                FROM recent_search_word_transaction
                WHERE user_id = ${userId}
                ORDER BY update_date DESC, id DESC
                LIMIT ${SEARCH_WORD_RETENTION_LIMIT}
              )
        `;
    };

    /**
     * 保持上限を超えた検索実績を削除する（LRU）
     * update_date の新しい上位 SEARCH_WORD_RETENTION_LIMIT 件を残し、それ以外を削除する。
     * @param frontUserIdModel
     * @param tx
     */
    async deleteExcessFrequentSearchWord(frontUserIdModel: FrontUserIdModel, tx: Prisma.TransactionClient): Promise<void> {

        const userId = frontUserIdModel.frontUserId;

        // update_date が同値の場合に備え id の降順を第2キーにして境界を一意にする。
        await tx.$executeRaw`
            DELETE FROM frequent_search_word_transaction
            WHERE user_id = ${userId}
              AND id NOT IN (
                SELECT id
                FROM frequent_search_word_transaction
                WHERE user_id = ${userId}
                ORDER BY update_date DESC, id DESC
                LIMIT ${SEARCH_WORD_RETENTION_LIMIT}
              )
        `;
    };
}