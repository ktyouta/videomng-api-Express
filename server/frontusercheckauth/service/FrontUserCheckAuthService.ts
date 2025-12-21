import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";


export class FrontUserCheckAuthService {

    /**
     * jwtを作成する
     * @param userIdModel 
     * @param inputPasswordModel 
     * @returns 
     */
    public createJsonWebToken(userIdModel: FrontUserIdModel) {

        try {
            const newJsonWebTokenModel = new NewJsonWebTokenModel(userIdModel);

            return newJsonWebTokenModel;
        } catch (err) {
            throw Error(`${err} endpoint:${ApiEndopoint.FRONT_USER_CHECK_AUTH}`);
        }
    }
}