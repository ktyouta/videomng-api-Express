import { FrontUserInfoMaster, FrontUserLoginMaster } from "@prisma/client";
import { UpdateFrontUserPasswordSelectEntity } from "../../entity/UpdateFrontUserPasswordSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFrontUserPasswordRepositoryInterface {

    /**
     * ユーザー取得
     */
    select(updateFrontUserPasswordSelectEntity: UpdateFrontUserPasswordSelectEntity): Promise<FrontUserLoginMaster[]>;

}