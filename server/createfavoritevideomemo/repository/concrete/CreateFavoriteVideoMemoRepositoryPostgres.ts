import { FavoriteVideoMemoTransaction } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { CreateFavoriteVideoDetailSelectEntity } from "../../entity/CreateFavoriteVideoDetailSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { CreateFavoriteVideoMemoRepositoryInterface } from "../interface/CreateFavoriteVideoMemoRepositoryInterface";
import { CreateFavoriteVideoMemoSeqSelectEntity } from "../../entity/CreateFavoriteVideoMemoSeqSelectEntity";



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
    public async select(createFavoriteVideoMemoSelectEntity: CreateFavoriteVideoDetailSelectEntity): Promise<FavoriteVideoMemoTransaction[]> {

        const userId = createFavoriteVideoMemoSelectEntity.frontUserId;
        const videoId = createFavoriteVideoMemoSelectEntity.videoId;

        const favoriteVideoMemoList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoMemoTransaction[]>`
            SELECT * 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return favoriteVideoMemoList;
    }


    /**
     * お気に入り動画メモのシーケンス番号取得
     * @param createFavoriteVideoMemoSelectEntity 
     * @returns 
     */
    public async selectMemoSeq(createFavoriteVideoMemoSeqSelectEntity: CreateFavoriteVideoMemoSeqSelectEntity): Promise<number[]> {

        const userId = createFavoriteVideoMemoSeqSelectEntity.frontUserId;
        const videoId = createFavoriteVideoMemoSeqSelectEntity.videoId;

        const seqList = await PrismaClientInstance.getInstance().$queryRaw<number[]>`
            SELECT max(video_memo_seq) + 1 
            FROM "favorite_video_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            video_id = ${videoId}
        `;

        return seqList;
    }
}