import { SelectShareVideoEntity } from "../../entity/SelectShareVideoEntity";
import { TargetVideoFolderType } from "../../type/TargetVideoFolderType";


/**
 * 永続ロジック用インターフェース
 */
export interface FolderShareVideosRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectFavoriteVideoList(entity: SelectShareVideoEntity): Promise<TargetVideoFolderType[]>;
}