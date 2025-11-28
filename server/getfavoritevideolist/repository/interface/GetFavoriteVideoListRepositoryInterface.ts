import { FavoriteVideoTransaction, FolderMaster, FrontUserInfoMaster } from "@prisma/client";
import { GetFavoriteVideoListSelectEntity } from "../../entity/GetFavoriteVideoListSelectEntity";
import { FavoriteVideoListCountType } from "../../model/FavoriteVideoListCountType";
import { GetFolderListEntity } from "../../entity/GetFolderListEntity";
import { FavoriteVideoFolderType } from "../../model/FavoriteVideoFolderType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoListRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity, defaultListLimit: number): Promise<FavoriteVideoTransaction[]>;

    /**
     * お気に入り動画件数取得
     */
    selectFavoriteVideoListCount(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity): Promise<FavoriteVideoListCountType[]>;

    /**
     * フォルダリスト取得
     * @param getFolderListEntity 
     */
    selectFolderList(getFolderListEntity: GetFolderListEntity): Promise<FavoriteVideoFolderType[]>;
}