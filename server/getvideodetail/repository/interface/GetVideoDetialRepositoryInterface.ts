import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetVideoDetialSelectEntity } from "../../entity/GetVideoDetialSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetVideoDetialRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getVideoDetialSelectEntity: GetVideoDetialSelectEntity): Promise<FavoriteVideoTransaction[]>;

}