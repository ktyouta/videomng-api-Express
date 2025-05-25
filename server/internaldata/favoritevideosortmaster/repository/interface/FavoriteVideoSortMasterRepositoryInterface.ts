import { Prisma, FavoriteVideoSortMaster } from "@prisma/client";
import { ViewStatusModel } from "../../../common/properties/ViewStatusModel";


/**
 * 永続ロジック用インターフェース
 */
export interface FavoriteVideoSortMasterRepositoryInterface {

    /**
     * ソートリストを取得
     */
    getListByKey(viewStatus: string): Promise<FavoriteVideoSortMaster | null>;

}

