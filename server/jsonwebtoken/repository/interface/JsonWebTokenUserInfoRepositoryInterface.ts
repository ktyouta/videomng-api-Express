import { FrontUserInfoType } from "../../../common/type/FrontUserInfoType";
import { JsonWebTokenUserInfoSelectEntity } from "../../entity/JsonWebTokenUserInfoSelectEntity";


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