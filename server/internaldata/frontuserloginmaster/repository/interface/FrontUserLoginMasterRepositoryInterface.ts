import { FrontUserLoginMaster, Prisma } from "@prisma/client";
import { FrontUserLoginMasterInsertEntity } from "../../entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterUpdateUserInfoEntity } from "../../entity/FrontUserLoginMasterUpdateUserInfoEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserLoginMasterRepositoryInterface {

    /**
     * フロントのユーザーログイン情報を作成
     */
    insert(frontUserLoginMasterInsertEntity: FrontUserLoginMasterInsertEntity,
        tx: Prisma.TransactionClient): Promise<FrontUserLoginMaster>;

    /**
     * フロントのユーザーログイン情報を更新
     */
    updateUserInfo(frontUserLoginMasterUpdateUserInfoEntity: FrontUserLoginMasterUpdateUserInfoEntity,
        tx: Prisma.TransactionClient): Promise<FrontUserLoginMaster>;
}

