import { FrontUserLoginMaster } from "@prisma/client";
import { JsonWebTokenUserInfoSelectEntity } from "../../entity/JsonWebTokenUserInfoSelectEntity";
import { FrontUserInfoType } from "../../type/FrontUserInfoType";


/**
 * 永続ロジック用インターフェース
 */
export interface JsonWebTokenUserInfoRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(JsonWebTokenUserInfoSelectEntity: JsonWebTokenUserInfoSelectEntity):
        Promise<FrontUserInfoType[]>;

}