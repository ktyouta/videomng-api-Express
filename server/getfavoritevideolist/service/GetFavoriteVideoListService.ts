import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteVideoListRepositorys } from "../repository/GetFavoriteVideoListRepositorys";
import { GetFavoriteVideoListSelectEntity } from "../entity/GetFavoriteVideoListSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoListRepositoryInterface } from "../repository/interface/GetFavoriteVideoListRepositoryInterface";
import { FavoriteVideoTransaction } from "@prisma/client";


export class GetFavoriteVideoListService {

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(jwt: string) {

        try {
            const jsonWebTokenVerifyModel = JsonWebTokenUserModel.get(jwt);

            return jsonWebTokenVerifyModel;
        } catch (err) {
            throw Error(`お気に入り動画リスト取得時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetFavoriteVideoListRepository(): GetFavoriteVideoListRepositoryInterface {
        return (new GetFavoriteVideoListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoList(frontUserIdModel: FrontUserIdModel): Promise<FavoriteVideoTransaction[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoListRepository = this.getGetFavoriteVideoListRepository();

        // お気に入り動画取得用Entity
        const getFavoriteVideoListSelectEntity = new GetFavoriteVideoListSelectEntity(frontUserIdModel);

        // お気に入り動画取得
        const favoriteVideos = await getGetFavoriteVideoListRepository.select(getFavoriteVideoListSelectEntity);

        return favoriteVideos;
    }


    /**
     * レスポンスを作成
     * @param frontUserInfoCreateRequestBody 
     * @param newJsonWebTokenModel 
     */
    public createResponse(favoriteVideoTransaction: FavoriteVideoTransaction[]): GetFavoriteVideoListResponseModel {
        return new GetFavoriteVideoListResponseModel(favoriteVideoTransaction);
    }

}