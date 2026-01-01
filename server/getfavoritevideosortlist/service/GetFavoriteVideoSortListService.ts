import { ViewStatusMaster } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { GetFavoriteVideoSortListRepositorys } from "../repository/GetFavoriteVideoSortListRepositorys";
import { GetFavoriteVideoSortListRepositoryInterface } from "../repository/interface/GetFavoriteVideoSortListRepositoryInterface";


export class GetFavoriteVideoSortListService {


    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetFavoriteVideoSortListRepository(): GetFavoriteVideoSortListRepositoryInterface {
        return (new GetFavoriteVideoSortListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画ソートリスト取得
     * @param userNameModel 
     */
    public async getFavoriteVideoSortList(): Promise<ViewStatusMaster[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoSortListRepository = this.getGetFavoriteVideoSortListRepository();

        // お気に入り動画ソートリスト取得
        const favoriteCommentList = await getGetFavoriteVideoSortListRepository.select();

        return favoriteCommentList;
    }

}