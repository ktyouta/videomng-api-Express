import { FavoriteVideoSortMaster, ViewStatusMaster } from "@prisma/client";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoSortListRepositoryInterface {

    /**
     * お気に入り動画ソートリスト取得
     */
    select(): Promise<FavoriteVideoSortMaster[]>;

}