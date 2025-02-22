import { FrontUserInfoMaster, FrontUserLoginMaster, SeqMaster } from "@prisma/client";
import { FrontUserLoginMasterInsertEntity } from "../../entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterUpdateEntity } from "../../entity/FrontUserLoginMasterUpdateEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserLoginMasterRepositoryInterface {

    /**
     * フロントのユーザーログイン情報を作成
     */
    insert(frontUserLoginMasterInsertEntity: FrontUserLoginMasterInsertEntity): Promise<FrontUserLoginMaster>;

    /**
     * フロントのユーザーログイン情報を更新
     */
    update(frontUserLoginMasterUpdateEntity: FrontUserLoginMasterUpdateEntity): Promise<FrontUserLoginMaster>;
}

