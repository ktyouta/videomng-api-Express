import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoCreateSelectEntity } from "../entity/FrontUserInfoCreateSelectEntity";
import { FrontUserInfoCreateRequestModel } from "../model/FrontUserInfoCreateRequestModel";
import { FrontUserInfoCreateRequestType } from "../model/FrontUserInfoCreateRequestType";
import { FrontUserInfoCreateResponseModel } from "../model/FrontUserInfoCreateResponseModel";
import { FrontUserInfoCreateRepositorys } from "../repository/FrontUserInfoCreateRepositorys";


export class CreateFrontUserInfoService {


    /**
     * リクエストボディの型変換
     * @param requestBody 
     */
    public parseRequestBody(requestBody: FrontUserInfoCreateRequestType): FrontUserInfoCreateRequestModel {
        return new FrontUserInfoCreateRequestModel(requestBody);
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
    public async checkUserNameExists(frontUserInfoCreateRequestBody: FrontUserInfoCreateRequestModel): Promise<boolean> {

        const userNameModel: FrontUserNameModel = frontUserInfoCreateRequestBody.frontUserNameModel;

        // 永続ロジック用オブジェクトを取得
        const frontUserInfoCreateRepositorys = new FrontUserInfoCreateRepositorys();
        const frontUserInfoCreateRepository = frontUserInfoCreateRepositorys.get(RepositoryType.POSTGRESQL);

        // ユーザー情報取得用Entity
        const frontUserInfoCreateSelectEntity = new FrontUserInfoCreateSelectEntity(userNameModel);

        // ユーザー情報を取得
        const activeUserInfoMasterList = await frontUserInfoCreateRepository.select(frontUserInfoCreateSelectEntity);

        return activeUserInfoMasterList.length > 0;
    }


    /**
     * ユーザー登録用データの作成
     * @param title 
     * @param publishedDate 
     * @param description 
     * @returns 
     */
    public createUserInfoMasterCreateBody(userId: FrontUserIdModel,
        parsedRequestBody: FrontUserInfoCreateRequestModel): FrontUserInfoMasterInsertEntity {

        return new FrontUserInfoMasterInsertEntity(
            userId,
            parsedRequestBody.frontUserNameModel,
            parsedRequestBody.frontUserBirthdayModel,
        );
    }


    /**
     * レスポンスを作成
     * @param frontUserInfoCreateRequestBody 
     * @param newJsonWebTokenModel 
     */
    public createResponse(frontUserInfoCreateRequestBody: FrontUserInfoCreateRequestModel,
        userIdModel: FrontUserIdModel,
        accessTokenModel: AccessTokenModel)
        : FrontUserInfoCreateResponseModel {

        return new FrontUserInfoCreateResponseModel(frontUserInfoCreateRequestBody, userIdModel, accessTokenModel);
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
    public createUserLoginMasterCreateBody(userId: FrontUserIdModel,
        parsedRequestBody: FrontUserInfoCreateRequestModel): FrontUserLoginMasterInsertEntity {

        return new FrontUserLoginMasterInsertEntity(
            userId,
            parsedRequestBody.frontUserPasswordModel,
            parsedRequestBody.frontUserSaltModel,
            parsedRequestBody.frontUserNameModel,
        );
    }
}