import { FavoriteVideoCategoryTransaction, FavoriteVideoMemoTransaction, FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { GetVideoListSelectEntity } from "../../entity/GetVideoListSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetVideoListRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getVideoListSelectEntity: GetVideoListSelectEntity): Promise<FavoriteVideoTransaction[]>;

}