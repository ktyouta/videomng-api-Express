import { ViewStatusMaster } from "@prisma/client";


/**
 * 永続ロジック用インターフェース
 */
export interface GetViewStatusListRepositoryInterface {

    /**
     * 視聴状況リスト取得
     */
    select(): Promise<ViewStatusMaster[]>;

}