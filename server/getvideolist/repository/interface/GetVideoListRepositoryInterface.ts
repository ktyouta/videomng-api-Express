import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { CreateSearchWordEntity } from "../../entity/CreateSearchWordEntity";
import { GetVideoListSelectEntity } from "../../entity/GetVideoListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetVideoListRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getVideoListSelectEntity: GetVideoListSelectEntity): Promise<FavoriteVideoTransaction[]>;

    /**
     * 最近の検索実績登録
     * @param entity
     * @param tx
     */
    insertRecentSearchWord(entity: CreateSearchWordEntity, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * あなたがよく検索するワード登録（存在すれば検索回数を加算、なければ新規登録）
     * @param entity
     * @param tx
     */
    upsertFrequentSearchWord(entity: CreateSearchWordEntity, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * 保持上限を超えた検索実績を削除する（LRU）
     * @param frontUserIdModel
     * @param tx
     */
    deleteExcessRecentSearchWord(frontUserIdModel: FrontUserIdModel, tx: Prisma.TransactionClient): Promise<void>;

    /**
     * 保持上限を超えた検索実績を削除する（LRU）
     * @param frontUserIdModel
     * @param tx
     */
    deleteExcessFrequentSearchWord(frontUserIdModel: FrontUserIdModel, tx: Prisma.TransactionClient): Promise<void>;
}