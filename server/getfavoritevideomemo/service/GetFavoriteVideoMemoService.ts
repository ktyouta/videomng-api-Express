import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoMemoResponseModel } from "../model/GetFavoriteVideoMemoResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteVideoMemoRepositorys } from "../repository/GetFavoriteVideoMemoRepositorys";
import { GetFavoriteVideoMemoSelectEntity } from "../entity/GetFavoriteVideoMemoSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoMemoRepositoryInterface } from "../repository/interface/GetFavoriteVideoMemoRepositoryInterface";
import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { Request } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";


export class GetFavoriteVideoMemoService {

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
            throw Error(`お気に入り動画メモ取得時の認証エラー ERROR:${err}`);
        }
    }

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