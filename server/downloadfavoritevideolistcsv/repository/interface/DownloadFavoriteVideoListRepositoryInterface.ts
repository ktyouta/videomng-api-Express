import { FavoriteVideoTransaction, FrontUserInfoMaster } from "@prisma/client";
import { DownloadFavoriteVideoListCsvSelectEntity } from "../../entity/DownloadFavoriteVideoListCsvSelectEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoListRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(downloadFavoriteVideoListCsvSelectEntity: DownloadFavoriteVideoListCsvSelectEntity): Promise<FavoriteVideoTransaction[]>;

}