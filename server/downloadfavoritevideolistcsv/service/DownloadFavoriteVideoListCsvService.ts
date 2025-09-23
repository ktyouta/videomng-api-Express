import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoListRepositoryInterface } from "../repository/interface/DownloadFavoriteVideoListRepositoryInterface";
import { FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { DownloadFavoriteVideoListCsvSelectEntity } from "../entity/DownloadFavoriteVideoListCsvSelectEntity";
import { DownloadFavoriteVideoListRepositorys } from "../repository/DownloadFavoriteVideoListRepositorys";


export class DownloadFavoriteVideoListCsvService {

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {
            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`お気に入り動画リスト取得時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetFavoriteVideoListRepository(): GetFavoriteVideoListRepositoryInterface {
        return (new DownloadFavoriteVideoListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoList(frontUserIdModel: FrontUserIdModel,): Promise<FavoriteVideoTransaction[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoListRepository = this.getGetFavoriteVideoListRepository();

        // お気に入り動画取得用Entity
        const getFavoriteVideoListSelectEntity = new DownloadFavoriteVideoListCsvSelectEntity(frontUserIdModel);

        // お気に入り動画取得
        const favoriteVideos = await getGetFavoriteVideoListRepository.selectFavoriteVideoList(getFavoriteVideoListSelectEntity);

        return favoriteVideos;
    }
}