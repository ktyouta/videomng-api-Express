import { FavoriteVideoTransaction } from "@prisma/client";
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
     * 検索実績登録（存在すれば検索回数を加算、なければ新規登録）
     * @param entity
     */
    upsertSearchWord(entity: CreateSearchWordEntity): Promise<void>;
}