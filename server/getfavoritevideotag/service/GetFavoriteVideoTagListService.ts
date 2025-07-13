import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoTagListResponseModel } from "../model/GetFavoriteVideoTagListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteVideoTagListRepositorys } from "../repository/GetFavoriteVideoTagListRepositorys";
import { GetFavoriteVideoTagListSelectEntity } from "../entity/GetFavoriteVideoTagListSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoTagListRepositoryInterface } from "../repository/interface/GetFavoriteVideoTagListRepositoryInterface";
import { FavoriteVideoTagTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { FavoriteVideoTagType } from "../type/FavoriteVideoTagType";


export class GetFavoriteVideoTagListService {

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
            throw Error(`お気に入り動画タグリスト取得時の認証エラー ERROR:${err}`);
        }
    }

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