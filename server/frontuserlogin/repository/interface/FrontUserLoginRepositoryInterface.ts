import { FrontUserInfoMaster, FrontUserLoginMaster } from "@prisma/client";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";
import { FrontUserInfoSelectEntity } from "../../entity/FrontUserInfoSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserLoginRepositoryInterface {

    /**
     * ログイン情報を取得
     */
    selectLoginUser(frontUserLoginSelectEntity: FrontUserLoginSelectEntity): Promise<FrontUserLoginMaster[]>;

    /**
     * ユーザー情報を取得
     */
    selectUserInfo(frontUserInfoSelectEntity: FrontUserInfoSelectEntity): Promise<FrontUserInfoMaster[]>;
}