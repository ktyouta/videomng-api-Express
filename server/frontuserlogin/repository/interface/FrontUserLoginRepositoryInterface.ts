import { FrontUserInfoMaster, FrontUserLoginMaster, Prisma } from "@prisma/client";
import { FrontUserInfoSelectEntity } from "../../entity/FrontUserInfoSelectEntity";
import { FrontUserInfoUpdateLastLoginDateEntity } from "../../entity/FrontUserInfoUpdateLastLoginDateEntity";
import { FrontUserInfoUpdatePasswordEntity } from "../../entity/FrontUserInfoUpdatePasswordEntity";
import { FrontUserLoginSelectEntity } from "../../entity/FrontUserLoginSelectEntity";


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

    /**
     * パスワードを更新
     * @param entity 
     * @param tx 
     */
    updatePassword(entity: FrontUserInfoUpdatePasswordEntity, tx: Prisma.TransactionClient): Promise<FrontUserLoginMaster>;
}