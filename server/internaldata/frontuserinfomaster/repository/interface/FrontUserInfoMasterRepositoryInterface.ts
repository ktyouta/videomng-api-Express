import { FrontUserInfoMaster, SeqMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../properties/FrontUserIdModel";
import { FrontUserInfoMasterUpdateEntity } from "../../entity/FrontUserInfoMasterUpdateEntity";
import { FrontUserInfoMasterInsertEntity } from "../../entity/FrontUserInfoMasterInsertEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface FrontUserInfoMasterRepositoryInterface {

    /**
     * フロントのユーザー情報を作成
     */
    insert(frontUserInfoMasterInsertEntity: FrontUserInfoMasterInsertEntity): Promise<FrontUserInfoMaster>;

    /**
     * フロントのユーザー情報を更新
     */
    update(frontUserInfoMasterUpdateEntity: FrontUserInfoMasterUpdateEntity): Promise<FrontUserInfoMaster>;
}

