import { TagMaster, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetTagListSelectEntity } from "../../entity/GetTagListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetTagListRepositoryInterface {

    /**
     * タグ取得
     * @param getTagListSelectEntity 
     */
    selectTag(getTagListSelectEntity: GetTagListSelectEntity): Promise<TagMaster[]>;

}