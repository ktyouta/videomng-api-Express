import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
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
     * 検索実績登録（存在すれば検索回数を加算、なければ新規登録）
     */
    async upsertSearchWord(entity: CreateSearchWordEntity): Promise<void> {

        const now = new Date();

        // (user_id, word) の一意制約を利用したアトミックな upsert。
        // 存在すれば search_count を +1、なければ search_count = 1 で新規作成する。
        await PrismaClientInstance.getInstance().searchWordTransaction.upsert({
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
}