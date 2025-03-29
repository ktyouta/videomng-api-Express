import { FavoriteCommentTransaction } from "@prisma/client";
import { CreateFavoriteCommentSelectEntity } from "../../entity/CreateFavoriteCommentSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFavoriteCommentRepositoryInterface {

    /**
     * お気に入りコメント情報取得
     * @param favoriteCommentInsertEntity 
     */
    select(createFavoriteCommentSelectEntity: CreateFavoriteCommentSelectEntity): Promise<FavoriteCommentTransaction[]>;
}