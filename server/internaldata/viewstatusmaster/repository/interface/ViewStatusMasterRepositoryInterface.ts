import { Prisma, ViewStatusMaster } from "@prisma/client";
import { ViewStatusModel } from "../../../common/properties/ViewStatusModel";


/**
 * 永続ロジック用インターフェース
 */
export interface ViewStatusMasterRepositoryInterface {

    /**
     * シーケンスを取得
     */
    getSequenceByKey(viewStatus: string): Promise<ViewStatusMaster | null>;

}

