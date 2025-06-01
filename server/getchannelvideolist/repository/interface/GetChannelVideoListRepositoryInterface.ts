import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetChannelVideoListSelectEntity } from "../../entity/GetChannelVideoListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetChannelVideoListRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getChannelVideoListSelectEntity: GetChannelVideoListSelectEntity): Promise<FavoriteVideoTransaction[]>;

}