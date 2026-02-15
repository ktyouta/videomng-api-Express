import { FavoriteVideoTransaction } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../../internaldata/foldermaster/model/FolderIdModel";
import { GetFavoriteVideoFolderSelectEntity } from "../../entity/GetFavoriteVideoFolderSelectEntity";
import { FavoriteVideoFolderType } from "../../model/FavoriteVideoFolderType";
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

    /**
     * フォルダリスト取得
     * @param userId 
     */
    selectFolderList(userId: FrontUserIdModel, folderIdModel: FolderIdModel): Promise<FavoriteVideoFolderType[]>;
}