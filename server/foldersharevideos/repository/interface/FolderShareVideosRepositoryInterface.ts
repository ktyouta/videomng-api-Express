import { FavoriteVideoTransaction } from "@prisma/client";
import { SelectShareVideoEntity } from "../../entity/SelectShareVideoEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FolderShareVideosRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(entity: SelectShareVideoEntity): Promise<FavoriteVideoTransaction[]>;
}