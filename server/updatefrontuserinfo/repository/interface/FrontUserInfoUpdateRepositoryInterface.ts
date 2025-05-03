import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserInfoUpdateSelectEntity } from "../../entity/FrontUserInfoUpdateSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserInfoUpdateRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(frontUserInfoUpdateSelectEntity: FrontUserInfoUpdateSelectEntity): Promise<FrontUserInfoMaster[]>;

}