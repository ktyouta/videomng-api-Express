import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RepositoryType } from '../../util/const/CommonConst';
import { FrontUserInfoSelectEntity } from '../entity/FrontUserInfoSelectEntity';
import { FrontUserLoginSelectEntity } from '../entity/FrontUserLoginSelectEntity';
import { FrontUserLoginRequestType } from '../model/FrontUserLoginRequestType';
import { FrontUserLoginRepositorys } from '../repository/FrontUserLoginRepositorys';
import { FrontUserLoginRepositoryInterface } from '../repository/interface/FrontUserLoginRepositoryInterface';


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
        inputFrontUserId: FrontUserIdModel) {

        const frontUserLoginSelectEntity = new FrontUserLoginSelectEntity(
            inputFrontUserId
        );

        const frontUserLoginList = frontUserLoginMasterRepository.selectLoginUser(frontUserLoginSelectEntity);

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

        const frontUserList = frontUserLoginMasterRepository.selectUserInfo(rontUserInfoSelectEntity);

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
}