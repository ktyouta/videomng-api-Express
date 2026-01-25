import { FavoriteVideoMemoTransaction } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../../internaldata/common/properties/VideoIdModel";
import { GetFavoriteVideoCustomCategorySelectEntity } from "../../entity/GetFavoriteVideoCustomCategorySelectEntity";
import { GetFavoriteVideoCustomMemoSelectEntity } from "../../entity/GetFavoriteVideoCustomMemoSelectEntity";
import { GetFavoriteVideoCustomSelectEntity } from "../../entity/GetFavoriteVideoCustomSelectEntity";
import { SelectTagListEntity } from "../../entity/SelectTagListEntity";
import { FavoriteVideoDetailCategoryType } from "../../type/FavoriteVideoDetailCategoryType";
import { FavoriteVideoDetailType } from "../../type/FavoriteVideoDetailType";
import { FavoriteVideoFolderType } from "../../type/FavoriteVideoFolderType";
import { FavoriteVideoTagType } from "../../type/FavoriteVideoTagType";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFavoriteVideoCustomRepositoryInterface {

    /**
     * お気に入り動画取得
     */
    selectVideo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoCustomSelectEntity): Promise<FavoriteVideoDetailType[]>;

    /**
     * お気に入り動画コメント取得
     * @param getFavoriteVideoDetialSelectEntity 
     */
    selectVideoMemo(getFavoriteVideoDetialSelectEntity: GetFavoriteVideoCustomMemoSelectEntity): Promise<FavoriteVideoMemoTransaction[]>;

    /**
     * お気に入り動画カテゴリ取得
     * @param getFavoriteVideoDetialCategorySelectEntity 
     */
    selectVideoCategory(getFavoriteVideoDetialCategorySelectEntity: GetFavoriteVideoCustomCategorySelectEntity): Promise<FavoriteVideoDetailCategoryType[]>;

    /**
     * お気に入り動画タグ取得
     */
    selectVideoTag(entity: SelectTagListEntity): Promise<FavoriteVideoTagType[]>;

    /**
     * お気に入り動画フォルダ取得
     */
    selectFavoriteVideoFolder(userIdModel: FrontUserIdModel, videoIdModel: VideoIdModel): Promise<FavoriteVideoFolderType[]>;
}