import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { CreateFavoriteVideoDetailSelectEntity } from "../../entity/CreateFavoriteVideoDetailSelectEntity";
import { CreateFavoriteVideoMemoSeqSelectEntity } from "../../entity/CreateFavoriteVideoMemoSeqSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface CreateFavoriteVideoMemoRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoMemoInsertEntity 
     */
    select(createFavoriteVideoMemoSelectEntity: CreateFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoTransaction[]>;

    /**
     * お気に入り動画メモのシーケンス番号取得
     */
    selectMemoSeq(createFavoriteVideoMemoSeqSelectEntity: CreateFavoriteVideoMemoSeqSelectEntity): Promise<number[]>;
}