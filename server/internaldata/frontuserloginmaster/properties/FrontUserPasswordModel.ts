import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { FrontUserSaltValueModel } from "./FrontUserSaltValueModel";


export class FrontUserPasswordModel {

    private _frontUserPassword: string;
    private static ENCODING: BufferEncoding = `hex`;
    private static HASH_LENGTH = 64;

    private constructor(hashedPassword: string) {

        this._frontUserPassword = hashedPassword;
    }

    /**
     * ハッシュ化
     */
    static hash(inputPassword: string, frontUserSaltValueModel: FrontUserSaltValueModel) {

        if (!inputPassword) {
            throw Error(`ユーザーのパスワードが設定されていません。`);
        }

        // パスワードをハッシュ化
        const salt = frontUserSaltValueModel.salt;
        const hashedPassword =
            scryptSync(inputPassword, salt, FrontUserPasswordModel.HASH_LENGTH).toString(FrontUserPasswordModel.ENCODING);

        return new FrontUserPasswordModel(hashedPassword);
    }

    static reConstruct(hashedPassword: string) {
        return new FrontUserPasswordModel(hashedPassword);
    }

    public get frontUserPassword() {
        return this._frontUserPassword;
    }

}