import { FrontUserLoginMaster } from "@prisma/client";
import { JsonWebTokenUserInfoSelectEntity } from "../../entity/JsonWebTokenUserInfoSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface JsonWebTokenUserInfoRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(JsonWebTokenUserInfoSelectEntity: JsonWebTokenUserInfoSelectEntity):
        Promise<FrontUserLoginMaster | null>;

}