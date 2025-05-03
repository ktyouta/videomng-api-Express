import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FrontUserInfoUpdateRequestModel } from "../model/FrontUserInfoUpdateRequestModel";
import { FrontUserInfoUpdateRequestType } from "../model/FrontUserInfoUpdateRequestType";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { FrontUserInfoUpdateResponseModel } from "../model/FrontUserInfoUpdateResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserInfoUpdateSelectEntity } from "../entity/FrontUserInfoUpdateSelectEntity";
import { FrontUserInfoUpdateRepositorys } from "../repository/FrontUserInfoUpdateRepositorys";
import { CookieModel } from "../../cookie/model/CookieModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { Request } from 'express';
import { FrontUserInfoMasterUpdateEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterUpdateEntity";
import { FrontUserLoginMasterUpdateUserInfoEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateUserInfoEntity";


export class UpdateFrontUserInfoService {


    /**
     * jwtからユーザー情報を取得
     * @param req 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {
            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`お気に入り動画更新時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * リクエストボディの型変換
     * @param requestBody 
     */
    public parseRequestBody(requestBody: FrontUserInfoUpdateRequestType): FrontUserInfoUpdateRequestModel {
        return new FrontUserInfoUpdateRequestModel(requestBody);
    }


    /**
     * 永続ロジック用オブジェクトを取得
     */
    public getFrontUserInfoMasterRepository(): FrontUserInfoMasterRepositoryInterface {
        return (new FrontUserInfoMasterRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * ユーザー重複チェック
     * @param userNameModel 
     */
    public async checkUserNameExists(frontUserInfoUpdateRequestBody: FrontUserInfoUpdateRequestModel): Promise<boolean> {

        const userNameModel: FrontUserNameModel = frontUserInfoUpdateRequestBody.frontUserNameModel;

        // 永続ロジック用オブジェクトを取得
        const frontUserInfoUpdateRepositorys = new FrontUserInfoUpdateRepositorys();
        const frontUserInfoUpdateRepository = frontUserInfoUpdateRepositorys.get(RepositoryType.POSTGRESQL);

        // ユーザー情報取得用Entity
        const frontUserInfoUpdateSelectEntity = new FrontUserInfoUpdateSelectEntity(userNameModel);

        // ユーザー情報を取得
        const activeUserInfoMasterList = await frontUserInfoUpdateRepository.select(frontUserInfoUpdateSelectEntity);

        return activeUserInfoMasterList.length > 0;
    }


    /**
     * ユーザー登録用データの作成
     * @param title 
     * @param publishedDate 
     * @param description 
     * @returns 
     */
    public updateUserInfoMasterUpdateBody(userId: FrontUserIdModel,
        parsedRequestBody: FrontUserInfoUpdateRequestModel): FrontUserInfoMasterUpdateEntity {

        return new FrontUserInfoMasterUpdateEntity(
            userId,
            parsedRequestBody.frontUserNameModel,
            parsedRequestBody.frontUserBirthdayModel,
        );
    }


    /**
     * ユーザーログインマスタ永続ロジック用オブジェクトを取得
     * @returns 
     */
    public getFrontUserLoginMasterRepository(): FrontUserLoginMasterRepositoryInterface {

        return (new FrontUserLoginMasterRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * ユーザーログイン情報登録用データの作成
     * @param title 
     * @param publishedDate 
     * @param description 
     * @returns 
     */
    public updateUserLoginMasterUpdateBody(userId: FrontUserIdModel,
        parsedRequestBody: FrontUserInfoUpdateRequestModel): FrontUserLoginMasterUpdateUserInfoEntity {

        return new FrontUserLoginMasterUpdateUserInfoEntity(
            userId,
            parsedRequestBody.frontUserNameModel,
        );
    }
}