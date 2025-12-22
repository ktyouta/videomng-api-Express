import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterUpdateEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterUpdateEntity";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserLoginMasterUpdateUserInfoEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateUserInfoEntity";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoUpdateSelectEntity } from "../entity/FrontUserInfoUpdateSelectEntity";
import { FrontUserInfoUpdateRequestModel } from "../model/FrontUserInfoUpdateRequestModel";
import { FrontUserInfoUpdateRequestType } from "../model/FrontUserInfoUpdateRequestType";
import { FrontUserInfoUpdateRepositorys } from "../repository/FrontUserInfoUpdateRepositorys";


export class UpdateFrontUserInfoService {


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
    public async checkUserNameExists(frontUserIdModel: FrontUserIdModel,
        frontUserInfoUpdateRequestBody: FrontUserInfoUpdateRequestModel): Promise<boolean> {

        const userNameModel: FrontUserNameModel = frontUserInfoUpdateRequestBody.frontUserNameModel;

        // 永続ロジック用オブジェクトを取得
        const frontUserInfoUpdateRepositorys = new FrontUserInfoUpdateRepositorys();
        const frontUserInfoUpdateRepository = frontUserInfoUpdateRepositorys.get(RepositoryType.POSTGRESQL);

        // ユーザー情報取得用Entity
        const frontUserInfoUpdateSelectEntity = new FrontUserInfoUpdateSelectEntity(
            frontUserIdModel,
            userNameModel
        );

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