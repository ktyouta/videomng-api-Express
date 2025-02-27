import { FrontUserLoginMaster } from "@prisma/client";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserLoginRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(frontUserLoginSelectEntity: FrontUserLoginSelectEntity): Promise<FrontUserLoginMaster[]>;

}