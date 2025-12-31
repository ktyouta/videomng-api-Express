import { FavoriteVideoTransaction } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { DownloadFavoriteVideoListCsvSelectEntity } from "../entity/DownloadFavoriteVideoListCsvSelectEntity";
import { GetFavoriteVideoListRepositoryInterface } from "../repository/interface/DownloadFavoriteVideoListRepositoryInterface";


export class DownloadFavoriteVideoListCsvService {

    constructor(private readonly repository: GetFavoriteVideoListRepositoryInterface) { }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoList(frontUserIdModel: FrontUserIdModel,): Promise<FavoriteVideoTransaction[]> {

        // お気に入り動画取得用Entity
        const getFavoriteVideoListSelectEntity = new DownloadFavoriteVideoListCsvSelectEntity(frontUserIdModel);

        // お気に入り動画取得
        const favoriteVideos = await this.repository.selectFavoriteVideoList(getFavoriteVideoListSelectEntity);

        return favoriteVideos;
    }
}