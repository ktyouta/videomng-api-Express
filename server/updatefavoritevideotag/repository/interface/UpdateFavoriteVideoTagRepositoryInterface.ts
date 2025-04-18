import { FavoriteVideoTagTransaction, TagMaster } from "@prisma/client";
import { UpdateFavoriteVideoTagFavoriteVideoSelectEntity } from "../../entity/UpdateFavoriteVideoTagFavoriteVideoSelectEntity";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { UpdateFavoriteVideoTagNextSeqType } from "../../type/UpdateFavoriteVideoTagNextSeqType";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";


/**
 * 永続ロジック用インターフェース
 */
export interface UpdateFavoriteVideoTagRepositoryInterface {

    /**
     * 動画情報取得
     * @param favoriteVideoTagInsertEntity 
     */
    selectFavoriteVideo(updateFavoriteVideoTagSelectEntity: UpdateFavoriteVideoTagFavoriteVideoSelectEntity): Promise<FavoriteVideoTagTransaction[]>;

    /**
     * タグマスタのシーケンス番号取得
     * @param frontUserIdModel 
     */
    selectTagSeq(frontUserIdModel: FrontUserIdModel): Promise<UpdateFavoriteVideoTagNextSeqType[]>;

    /**
     * タグマスタ取得
     * @param updateFavoriteVideoTagTagMasterSelectEntity 
     */
    selectTagMaster(tagNameModel: TagNameModel): Promise<TagMaster[]>;
}