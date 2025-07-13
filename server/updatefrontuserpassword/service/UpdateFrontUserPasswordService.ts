import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { CookieModel } from "../../cookie/model/CookieModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { Request } from 'express';
import { UpdateFrontUserPasswordRequestType } from "../model/UpdateFrontUserPasswordRequestType";
import { UpdateFrontUserPasswordRepositorys } from "../repository/UpdateFrontUserPasswordRepositorys";
import { UpdateFrontUserPasswordSelectEntity } from "../entity/UpdateFrontUserPasswordSelectEntity";
import { UpdateFrontUserPasswordRequestModel } from "../model/UpdateFrontUserPasswordRequestModel";
import { FrontUserInfoMaster, FrontUserLoginMaster } from "@prisma/client";
import { FrontUserLoginMasterUpdateEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateEntity";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";


export class UpdateFrontUserPasswordService {


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
    public parseRequestBody(requestBody: UpdateFrontUserPasswordRequestType): UpdateFrontUserPasswordRequestModel {
        return new UpdateFrontUserPasswordRequestModel(requestBody);
    }


    /**
     * ユーザー情報取得
     * @param userNameModel 
     */
    public async getUserInfo(userIdModel: FrontUserIdModel,): Promise<FrontUserLoginMaster[]> {

        // 永続ロジック用オブジェクトを取得
        const updateFrontUserPasswordRepositorys = new UpdateFrontUserPasswordRepositorys();
        const updateFrontUserPasswordRepository = updateFrontUserPasswordRepositorys.get(RepositoryType.POSTGRESQL);

        // ユーザー情報取得用Entity
        const updateFrontUserPasswordSelectEntity = new UpdateFrontUserPasswordSelectEntity(userIdModel);

        // ユーザー情報を取得
        const userInfoList = await updateFrontUserPasswordRepository.select(updateFrontUserPasswordSelectEntity);

        return userInfoList;
    }


    /**
     * ユーザーログインマスタ永続ロジック用オブジェクトを取得
     * @returns 
     */
    public getFrontUserLoginMasterRepository(): FrontUserLoginMasterRepositoryInterface {

        return (new FrontUserLoginMasterRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * パスワード更新用データの作成
     * @param title 
     * @param publishedDate 
     * @param description 
     * @returns 
     */
    public updateUserLoginMasterUpdateBody(userId: FrontUserIdModel,
        parsedRequestBody: UpdateFrontUserPasswordRequestModel): FrontUserLoginMasterUpdateEntity {

        return new FrontUserLoginMasterUpdateEntity(
            userId,
            parsedRequestBody.newPasswordModel,
            parsedRequestBody.frontUserSaltValueModel,
        );
    }


    /**
     * jwtを作成する
     * @param userIdModel 
     * @param frontUserInfoCreateRequestBody 
     * @returns 
     */
    public createJsonWebToken(userIdModel: FrontUserIdModel,
        updateFrontUserPasswordRequestBody: UpdateFrontUserPasswordRequestModel
    ) {

        const frontUserPassword = updateFrontUserPasswordRequestBody.newPasswordModel;

        try {
            const newJsonWebTokenModel = new NewJsonWebTokenModel(userIdModel, frontUserPassword);

            return newJsonWebTokenModel;
        } catch (err) {
            throw Error(`${err} endpoint:${ApiEndopoint.FRONT_USER_PASSWORD_ID}`);
        }
    }
}