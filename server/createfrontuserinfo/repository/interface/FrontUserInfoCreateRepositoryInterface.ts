import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserInfoCreateSelectEntity } from "../../entity/FrontUserInfoCreateSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserInfoCreateRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(frontUserInfoCreateSelectEntity: FrontUserInfoCreateSelectEntity): Promise<FrontUserInfoMaster[]>;

}