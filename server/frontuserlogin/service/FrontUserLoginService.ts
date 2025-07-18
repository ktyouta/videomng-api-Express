import { Prisma } from '@prisma/client';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FrontUserNameModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserNameModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RepositoryType } from '../../util/const/CommonConst';
import { FrontUserInfoSelectEntity } from '../entity/FrontUserInfoSelectEntity';
import { FrontUserLoginSelectEntity } from '../entity/FrontUserLoginSelectEntity';
import { FrontUserLoginRequestType } from '../model/FrontUserLoginRequestType';
import { FrontUserLoginRepositorys } from '../repository/FrontUserLoginRepositorys';
import { FrontUserLoginRepositoryInterface } from '../repository/interface/FrontUserLoginRepositoryInterface';
import { FrontUserInfoUpdateLastLoginDateEntity } from '../entity/FrontUserInfoUpdateLastLoginDateEntity';


export class FrontUserLoginService {


    /**
     * 永続ロジック用オブジェクトを取得
     */
    public getFrontUserLoginMasterRepository(): FrontUserLoginRepositoryInterface {

        return (new FrontUserLoginRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * ログインユーザーを取得
     * @param frontUserLoginRequestBody 
     */
    public async getLoginUser(frontUserLoginMasterRepository: FrontUserLoginRepositoryInterface,
        userNameModel: FrontUserNameModel) {

        const frontUserLoginSelectEntity = new FrontUserLoginSelectEntity(
            userNameModel
        );

        const frontUserLoginList = await frontUserLoginMasterRepository.selectLoginUser(frontUserLoginSelectEntity);

        return frontUserLoginList;
    }


    /**
     * ユーザーを情報
     * @param frontUserLoginRequestBody 
     */
    public async getUserInfo(frontUserLoginMasterRepository: FrontUserLoginRepositoryInterface,
        inputFrontUserId: FrontUserIdModel) {

        const rontUserInfoSelectEntity = new FrontUserInfoSelectEntity(
            inputFrontUserId
        );

        const frontUserList = await frontUserLoginMasterRepository.selectUserInfo(rontUserInfoSelectEntity);

        return frontUserList;
    }


    /**
     * jwtを作成する
     * @param userIdModel 
     * @param frontUserInfoCreateRequestBody 
     * @returns 
     */
    public createJsonWebToken(userIdModel: FrontUserIdModel,
        inputPasswordModel: FrontUserPasswordModel
    ) {

        try {
            const newJsonWebTokenModel = new NewJsonWebTokenModel(userIdModel, inputPasswordModel);

            return newJsonWebTokenModel;
        } catch (err) {
            throw Error(`${err} endpoint:${ApiEndopoint.FRONT_USER_INFO}`);
        }
    }


    /**
     * ユーザーの最終ログイン日時を更新する
     * @param frontUserIdModel 
     * @param tx 
     */
    public async updateLastLoginDate(frontUserLoginMasterRepository: FrontUserLoginRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient
    ) {

        const frontUserInfoUpdateLastLoginDateEntity = new FrontUserInfoUpdateLastLoginDateEntity(frontUserIdModel);

        const frontUser = await frontUserLoginMasterRepository.updateLastLoginDate(frontUserInfoUpdateLastLoginDateEntity, tx);

        return frontUser;
    }
}