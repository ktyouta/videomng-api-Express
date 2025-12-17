import { Request } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";


export class FrontUserCheckAuthService {

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
            throw Error(`お気に入り動画登録時の認証エラー ERROR:${err}`);
        }
    }


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