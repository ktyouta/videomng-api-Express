import ENV from '../../env.json';
import { FrontUserIdModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserIdModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';


export class NewJsonWebTokenModel {

    private readonly jwt = require("jsonwebtoken");
    private readonly _token: string;

    constructor(frontUserIdModel: FrontUserIdModel, frontUserPasswordModel: FrontUserPasswordModel) {

        const jwtSecretKey = ENV.JSON_WEB_TOKEN_KEY;

        if (!jwtSecretKey) {
            throw Error(`設定ファイルにjwtの秘密鍵が設定されていません。`);
        }

        const frontUserId = frontUserIdModel.frontUserId;

        if (!frontUserId) {
            throw Error(`jwtの作成にはユーザーIDが必要です。`);
        }

        const frontUserPassword = frontUserPasswordModel.frontUserPassword;

        if (!frontUserPassword) {
            throw Error(`jwtの作成にはパスワードが必要です。`);
        }

        const jwtStr = `${frontUserId},${frontUserPassword}`;
        this._token = this.jwt.sign({ ID: jwtStr }, jwtSecretKey);
    }

    get token() {
        return this._token;
    }

}