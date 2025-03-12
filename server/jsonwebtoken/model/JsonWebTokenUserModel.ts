import { CookieModel } from '../../cookie/model/CookieModel';
import ENV from '../../env.json';
import { FrontUserIdModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserIdModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { envConfig } from '../../util/const/EnvConfig';
import { JsonFileData } from '../../util/service/JsonFileData';
import { JsonWebTokenUserInfoSelectEntity } from '../entity/JsonWebTokenUserInfoSelectEntity';
import { JsonWebTokenUserInfoRepositorys } from '../repository/JsonWebTokenUserInfoRepositorys';
import { NewJsonWebTokenModel } from './NewJsonWebTokenModel';


export class JsonWebTokenUserModel {

    private static readonly jwt = require("jsonwebtoken");
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;


    private constructor(frontUserIdModel: FrontUserIdModel,
        frontUserPassword: FrontUserPasswordModel
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._frontUserPasswordModel = frontUserPassword;
    }


    /**
     * jwtからユーザー情報を取得
     * @param token 
     * @returns 
     */
    static async get(cookieModel: CookieModel) {

        if (!NewJsonWebTokenModel.COOKIE_KEY) {
            throw Error(`設定ファイルにcookie(jwt)のキーが設定されていません。`);
        }

        const token = cookieModel.cookie[NewJsonWebTokenModel.COOKIE_KEY];

        if (!token) {
            throw Error(`トークンが存在しません。`);
        }

        const jwtSecretKey = envConfig.jwtKey;

        if (!jwtSecretKey) {
            throw Error(`設定ファイルにjwtの秘密鍵が設定されていません。`);
        }

        try {

            const decoded = this.jwt.verify(token, jwtSecretKey);

            if (!decoded) {
                throw Error(`jwtから認証情報の取得に失敗しました。`);
            }

            const id: string = decoded.ID;
            const verifyArray: string[] = id.split(',');

            if (!verifyArray || verifyArray.length !== 2) {
                throw Error(`jwtの認証情報が不正です。`);
            }

            const userId = Number.parseInt(verifyArray[0]);

            const frontUserIdModel: FrontUserIdModel = FrontUserIdModel.reConstruct(userId);
            const frontUserPassword: FrontUserPasswordModel = FrontUserPasswordModel.reConstruct(verifyArray[1]);

            // ユーザーマスタファイルからデータを取得
            const userInfoMaster = await this.getFrontUser(frontUserIdModel, frontUserPassword);

            // jwtのユーザー情報がユーザーマスタに存在しない
            if (!userInfoMaster) {
                throw Error(`jwtのユーザー情報がユーザーログインマスタに存在しません。`);
            }

            return new JsonWebTokenUserModel(frontUserIdModel, frontUserPassword);
        } catch (err) {
            throw Error(`jwt認証中にエラーが発生しました。ERROR:${err}`);
        }
    }


    get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    get frontUserPasswordModel() {
        return this._frontUserPasswordModel;
    }


    /**
     * jwt認証用のユーザー情報を取得
     * @param frontUserIdModel 
     * @param frontUserPassword 
     * @returns 
     */
    private static getFrontUser(frontUserIdModel: FrontUserIdModel,
        frontUserPassword: FrontUserPasswordModel) {

        // 永続ロジック用オブジェクトを取得
        const frontUserInfoCreateRepository = (new JsonWebTokenUserInfoRepositorys()).get(RepositoryType.POSTGRESQL);

        // ユーザログイン情報取得用Entity
        const frontUserInfoCreateSelectEntity = new JsonWebTokenUserInfoSelectEntity(frontUserIdModel, frontUserPassword);

        // ユーザーログイン情報を取得
        const userInfoMasterList = frontUserInfoCreateRepository.select(frontUserInfoCreateSelectEntity);

        return userInfoMasterList;
    }

}