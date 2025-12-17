import { CookieModel } from '../../cookie/model/CookieModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { envConfig } from '../../util/const/EnvConfig';
import { JsonWebTokenUserInfoSelectEntity } from '../entity/JsonWebTokenUserInfoSelectEntity';
import { JsonWebTokenUserInfoRepositorys } from '../repository/JsonWebTokenUserInfoRepositorys';
import { FrontUserInfoType } from '../type/FrontUserInfoType';
import { JsonWebTokenModel } from './JsonWebTokenModel';


export class JsonWebTokenUserModel {

    private static readonly jwt = require("jsonwebtoken");
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // フロントユーザー情報
    private readonly _frontUserInfo: FrontUserInfoType;


    private constructor(frontUserIdModel: FrontUserIdModel,
        frontUserInfo: FrontUserInfoType
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._frontUserInfo = frontUserInfo;
    }


    /**
     * jwtからユーザー情報を取得
     * @param token 
     * @returns 
     */
    static async get(cookieModel: CookieModel) {

        // jwt
        const jsonWebTokenModel = new JsonWebTokenModel(cookieModel);
        const token = jsonWebTokenModel.token;

        if (!token) {
            throw Error(`トークンが存在しません。`);
        }

        const jwtSecretKey = envConfig.jwtKey;

        if (!jwtSecretKey) {
            throw Error(`設定ファイルにjwtの秘密鍵が設定されていません。`);
        }

        try {

            const decoded = this.jwt.verify(token, jwtSecretKey);

            if (!decoded || typeof decoded !== `object`) {
                throw Error(`jwtから認証情報の取得に失敗しました。`);
            }

            const id: string = decoded.sub;

            if (!id) {
                throw Error(`jwtの認証情報が不正です。`);
            }

            const userId = Number.parseInt(id);

            const frontUserIdModel: FrontUserIdModel = FrontUserIdModel.reConstruct(userId);

            // ユーザーマスタからデータを取得
            const frontUserList = await this.getFrontUser(frontUserIdModel);

            // jwtのユーザー情報がユーザーマスタに存在しない
            if (!frontUserList || frontUserList.length === 0) {
                throw Error(`jwtのユーザー情報がユーザーログインマスタに存在しません。`);
            }

            return new JsonWebTokenUserModel(
                frontUserIdModel,
                frontUserList[0],
            );
        } catch (err) {
            throw Error(`jwt認証中にエラーが発生しました。ERROR:${err}`);
        }
    }


    get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get frontUserInfo() {
        return this._frontUserInfo;
    }

    /**
     * jwt認証用のユーザー情報を取得
     * @param frontUserIdModel 
     * @param frontUserPassword 
     * @returns 
     */
    private static getFrontUser(frontUserIdModel: FrontUserIdModel) {

        // 永続ロジック用オブジェクトを取得
        const frontUserInfoCreateRepository = (new JsonWebTokenUserInfoRepositorys()).get(RepositoryType.POSTGRESQL);

        // ユーザログイン情報取得用Entity
        const frontUserInfoCreateSelectEntity = new JsonWebTokenUserInfoSelectEntity(frontUserIdModel);

        // ユーザーログイン情報を取得
        const frontUserList = frontUserInfoCreateRepository.select(frontUserInfoCreateSelectEntity);

        return frontUserList;
    }

}