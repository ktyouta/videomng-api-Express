import { FavoriteVideoTransaction } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { DownloadFavoriteVideoListCsvSelectEntity } from "../../entity/DownloadFavoriteVideoListCsvSelectEntity";
import { GetFavoriteVideoListRepositoryInterface } from "../interface/DownloadFavoriteVideoListRepositoryInterface";



/**
 * 永続ロジック用クラス
 */
export class GetFavoriteVideoListRepositoryPostgres implements GetFavoriteVideoListRepositoryInterface {

  constructor() {
  }

  /**
   * お気に入り動画取得
   * @returns 
   */
  async selectFavoriteVideoList(downloadFavoriteVideoListCsvSelectEntity: DownloadFavoriteVideoListCsvSelectEntity): Promise<FavoriteVideoTransaction[]> {

    const frontUserId = downloadFavoriteVideoListCsvSelectEntity.frontUserId;

    let sql = `
            SELECT
              user_id as "userId",
              video_id as "videoId"
            FROM favorite_video_transaction a
            WHERE user_id = $1
              AND delete_flg = '0'
            ORDER BY a.update_date desc
          `;

    const params = [];
    params.push(frontUserId);

    const favoriteVideoList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FavoriteVideoTransaction[]>(sql, ...params);

    return favoriteVideoList;
  }

}