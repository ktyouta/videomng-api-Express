import { FrontUserInfoMaster, FrontUserLoginMaster, Prisma } from "@prisma/client";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";
import { FrontUserInfoSelectEntity } from "../../entity/FrontUserInfoSelectEntity";
import { FrontUserInfoUpdateLastLoginDateEntity } from "../../entity/FrontUserInfoUpdateLastLoginDateEntity";


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

    /**
     * ユーザーの最終ログイン日時を更新
     */
    updateLastLoginDate(frontUserInfoUpdateLastLoginDateEntity: FrontUserInfoUpdateLastLoginDateEntity,
        tx: Prisma.TransactionClient): Promise<FrontUserInfoMaster>;
}