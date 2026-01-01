import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { GetFavoriteVideoMemoSelectEntity } from "../entity/GetFavoriteVideoMemoSelectEntity";
import { GetFavoriteVideoMemoRepositorys } from "../repository/GetFavoriteVideoMemoRepositorys";
import { GetFavoriteVideoMemoRepositoryInterface } from "../repository/interface/GetFavoriteVideoMemoRepositoryInterface";


export class GetFavoriteVideoMemoService {

    /**
     * 永続ロジック用オブジェクトを取得
     */
    public getGetFavoriteVideoMemoRepository(): GetFavoriteVideoMemoRepositoryInterface {
        return (new GetFavoriteVideoMemoRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画メモ取得
     * @param userNameModel 
     */
    public async getFavoriteVideoMemo(getGetFavoriteVideoMemoRepository: GetFavoriteVideoMemoRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画メモ取得用Entity
        const getFavoriteVideoMemoSelectEntity = new GetFavoriteVideoMemoSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画メモ取得
        const favoriteVideoMemo = await getGetFavoriteVideoMemoRepository.selectVideoMemo(getFavoriteVideoMemoSelectEntity);

        return favoriteVideoMemo;
    }
}