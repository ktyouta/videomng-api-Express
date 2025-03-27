import { BlockCommentTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetBlockCommentListSelectEntity } from "../../entity/GetBlockCommentListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetBlockCommentListRepositoryInterface {

    /**
     * ブロックコメント取得
     */
    select(getBlockCommentListSelectEntity: GetBlockCommentListSelectEntity): Promise<BlockCommentTransaction[]>;

}