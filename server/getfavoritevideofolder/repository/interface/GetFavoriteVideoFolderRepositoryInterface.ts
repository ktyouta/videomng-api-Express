import { FavoriteVideoTransaction, FolderMaster, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoFolderSelectEntity } from "../../entity/GetFavoriteVideoFolderSelectEntity";
import { FavoriteVideoListCountType } from "../../model/FavoriteVideoListCountType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoFolderRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity, defaultListLimit: number): Promise<FavoriteVideoTransaction[]>;

    /**
     * お気に入り動画件数取得
     */
    selectFavoriteVideoListCount(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity): Promise<FavoriteVideoListCountType[]>;
}