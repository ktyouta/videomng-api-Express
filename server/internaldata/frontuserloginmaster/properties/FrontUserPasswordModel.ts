import { createHmac, scryptSync } from "crypto";
import { PepperModel } from "../../../pepper/model/PepperModel";
import { FrontUserSaltValueModel } from "./FrontUserSaltValueModel";


export class FrontUserPasswordModel {

    private _frontUserPassword: string;
    private static ENCODING: BufferEncoding = `hex`;
    private static HASH_LENGTH = 64;

    private constructor(hashedPassword: string) {

        this._frontUserPassword = hashedPassword;
    }

    /**
     * ハッシュ化(salt + pepper)
     */
    static secureHash(inputPassword: string, frontUserSaltValueModel: FrontUserSaltValueModel, pepperModel: PepperModel) {

        if (!inputPassword) {
            throw Error(`ユーザーのパスワードが設定されていません。`);
        }

        const pepepr = pepperModel.value;
        const keyedPassword = createHmac('sha256', pepepr).update(inputPassword).digest();

        // パスワードをハッシュ化
        const salt = frontUserSaltValueModel.salt;
        const hashedPassword =
            scryptSync(keyedPassword, salt, FrontUserPasswordModel.HASH_LENGTH).toString(FrontUserPasswordModel.ENCODING);

        return new FrontUserPasswordModel(hashedPassword);
    }

    /**
     * ハッシュ化(salt)
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