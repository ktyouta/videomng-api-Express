import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { GetFavoriteVideoTagListSelectEntity } from "../entity/GetFavoriteVideoTagListSelectEntity";
import { GetFavoriteVideoTagListRepositorys } from "../repository/GetFavoriteVideoTagListRepositorys";
import { GetFavoriteVideoTagListRepositoryInterface } from "../repository/interface/GetFavoriteVideoTagListRepositoryInterface";
import { FavoriteVideoTagType } from "../type/FavoriteVideoTagType";


export class GetFavoriteVideoTagListService {

    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetFavoriteVideoTagListRepository(): GetFavoriteVideoTagListRepositoryInterface {
        return (new GetFavoriteVideoTagListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画タグリスト取得
     * @param userNameModel 
     */
    public async getFavoriteVideoTagList(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,): Promise<FavoriteVideoTagType[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoTagListRepository = this.getGetFavoriteVideoTagListRepository();

        // お気に入り動画タグリスト取得用Entity
        const getFavoriteVideoTagListSelectEntity = new GetFavoriteVideoTagListSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画タグリスト取得
        const favoriteVideoTagList = await getGetFavoriteVideoTagListRepository.select(getFavoriteVideoTagListSelectEntity);

        return favoriteVideoTagList;
    }
}