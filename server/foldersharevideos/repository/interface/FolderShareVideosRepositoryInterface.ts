import { FavoriteVideoTransaction } from "@prisma/client";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { SelectShareVideoEntity } from "../../entity/SelectShareVideoEntity";
import { FolderInfoType } from "../../type/FolderInfoType";


/**
 * 永続ロジック用インターフェース
 */
export interface FolderShareVideosRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(entity: SelectShareVideoEntity): Promise<FavoriteVideoTransaction[]>;

    /**
     * 対象動画のフォルダ情報を取得
     */
    selectFolderList(entity: SelectFolderEntity): Promise<FolderInfoType[]>;
}