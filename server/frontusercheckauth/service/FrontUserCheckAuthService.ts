import { Prisma } from "@prisma/client";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";


export class FrontUserCheckAuthService {

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(jwt: string) {

        try {
            const jsonWebTokenVerifyModel = JsonWebTokenUserModel.get(jwt);

            return jsonWebTokenVerifyModel;
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
    public createJsonWebToken(userIdModel: FrontUserIdModel,
        inputPasswordModel: FrontUserPasswordModel
    ) {

        try {
            const newJsonWebTokenModel = new NewJsonWebTokenModel(userIdModel, inputPasswordModel);

            return newJsonWebTokenModel;
        } catch (err) {
            throw Error(`${err} endpoint:${ApiEndopoint.FRONT_USER_CHECK_AUTH}`);
        }
    }
}