import { Prisma } from '@prisma/client';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FrontUserNameModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserNameModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { FrontUserInfoSelectEntity } from '../entity/FrontUserInfoSelectEntity';
import { FrontUserInfoUpdateLastLoginDateEntity } from '../entity/FrontUserInfoUpdateLastLoginDateEntity';
import { FrontUserInfoUpdatePasswordEntity } from '../entity/FrontUserInfoUpdatePasswordEntity';
import { FrontUserLoginSelectEntity } from '../entity/FrontUserLoginSelectEntity';
import { FrontUserLoginRepositoryInterface } from '../repository/interface/FrontUserLoginRepositoryInterface';


export class FrontUserLoginService {

    constructor(private readonly repository: FrontUserLoginRepositoryInterface) { }

    /**
     * ログインユーザーを取得
     * @param frontUserLoginRequestBody 
     */
    public async getLoginUser(userNameModel: FrontUserNameModel) {

        const frontUserLoginSelectEntity = new FrontUserLoginSelectEntity(
            userNameModel
        );

        const frontUserLoginList = await this.repository.selectLoginUser(frontUserLoginSelectEntity);

        return frontUserLoginList;
    }

    /**
     * ユーザーを情報
     * @param frontUserLoginRequestBody 
     */
    public async getUserInfo(inputFrontUserId: FrontUserIdModel) {

        const rontUserInfoSelectEntity = new FrontUserInfoSelectEntity(
            inputFrontUserId
        );

        const frontUserList = await this.repository.selectUserInfo(rontUserInfoSelectEntity);

        return frontUserList;
    }

    /**
     * jwtを作成する
     * @param userIdModel 
     * @param frontUserInfoCreateRequestBody 
     * @returns 
     */
    public createJsonWebToken(userIdModel: FrontUserIdModel) {

        try {
            const newJsonWebTokenModel = new NewJsonWebTokenModel(userIdModel);

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
    public async updateLastLoginDate(
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient
    ) {

        const frontUserInfoUpdateLastLoginDateEntity = new FrontUserInfoUpdateLastLoginDateEntity(frontUserIdModel);

        const frontUser = await this.repository.updateLastLoginDate(frontUserInfoUpdateLastLoginDateEntity, tx);

        return frontUser;
    }

    /**
     * パスワードを更新する
     * @param frontUserIdModel 
     * @param tx 
     */
    public async updatePassword(frontUserIdModel: FrontUserIdModel,
        passwordModel: FrontUserPasswordModel,
        tx: Prisma.TransactionClient
    ) {

        const entity = new FrontUserInfoUpdatePasswordEntity(frontUserIdModel, passwordModel);

        const frontUser = await this.repository.updatePassword(entity, tx);

        return frontUser;
    }
}