import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { CreateFavoriteVideoDetailSelectEntity } from "../../entity/CreateFavoriteVideoDetailSelectEntity";
import { CreateFavoriteVideoMemoSeqSelectEntity } from "../../entity/CreateFavoriteVideoMemoSeqSelectEntity";
import { CreateFavoriteVideoMemoNextSeqType } from "../../Type/CreateFavoriteVideoMemoNextSeqType";
import { CreateFavoriteVideoMemoRepositoryInterface } from "../interface/CreateFavoriteVideoMemoRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFavoriteVideoMemoRepositoryPostgres implements CreateFavoriteVideoMemoRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入り動画情報取得
     * @param frontFavoriteVideoMemoInfoMasterModel 
     * @returns 
     */
    public async select(createFavoriteVideoMemoSelectEntity: CreateFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoTransaction[]> {

        const userId = createFavoriteVideoMemoSelectEntity.frontUserId;
        const videoId = createFavoriteVideoMemoSelectEntity.videoId;

        const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoList;
    }


    /**
     * お気に入り動画メモのシーケンス番号取得
     * @param createFavoriteVideoMemoSelectEntity 
     * @returns 
     */
    public async selectMemoSeq(createFavoriteVideoMemoSeqSelectEntity: CreateFavoriteVideoMemoSeqSelectEntity)
        : Promise<CreateFavoriteVideoMemoNextSeqType[]> {

        const userId = createFavoriteVideoMemoSeqSelectEntity.frontUserId;
        const videoId = createFavoriteVideoMemoSeqSelectEntity.videoId;

        const seqList = await PrismaClientInstance.getInstance().$queryRaw<CreateFavoriteVideoMemoNextSeqType[]>`
            SELECT COALESCE(MAX(video_memo_seq), 0) + 1 as "nextSeq"
            FROM "favorite_video_memo_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return seqList;
    }
}