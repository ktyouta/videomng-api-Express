import { FrontUserLoginMaster, Prisma } from "@prisma/client";
import { FrontUserLoginMasterUpdateEntity } from "../../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateEntity";
import { UpdateFrontUserPasswordSelectEntity } from "../../entity/UpdateFrontUserPasswordSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFrontUserPasswordRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(updateFrontUserPasswordSelectEntity: UpdateFrontUserPasswordSelectEntity): Promise<FrontUserLoginMaster[]>;

    /**
     * フロントのユーザーログイン情報を更新
     */
    update(frontUserLoginMasterUpdateEntity: FrontUserLoginMasterUpdateEntity,
        tx: Prisma.TransactionClient): Promise<FrontUserLoginMaster>;
}