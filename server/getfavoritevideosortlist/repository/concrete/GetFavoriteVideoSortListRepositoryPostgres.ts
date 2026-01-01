import { FavoriteVideoSortMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { GetFavoriteVideoSortListRepositoryInterface } from "../interface/GetFavoriteVideoSortListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoSortListRepositoryPostgres implements GetFavoriteVideoSortListRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画ソートリスト取得
     * @returns 
     */
    async select(): Promise<FavoriteVideoSortMaster[]> {

        const viewStatus = await PrismaClientInstance.getInstance().$queryRaw<FavoriteVideoSortMaster[]>`
            SELECT
                id,
                label 
            FROM "favorite_video_sort_master" 
            WHERE "delete_flg" = '0'
            ORDER BY id
            `;

        return viewStatus;
    }

}