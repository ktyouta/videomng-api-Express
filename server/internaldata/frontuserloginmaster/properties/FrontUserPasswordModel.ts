import { scryptSync, randomBytes, timingSafeEqual } from "crypto";


export class FrontUserPasswordModel {

    private _frontUserPassword: string;
    private static BYTE_SIZE = 16;
    private static ENCODING: BufferEncoding = `hex`;
    private static HASH_LENGTH = 64;

    private constructor(hashedPassword: string) {

        this._frontUserPassword = hashedPassword;
    }

    static hash(inputPassword: string) {

        if (!inputPassword) {
            throw Error(`ユーザーのパスワードが設定されていません。`);
        }

        // パスワードをハッシュ化
        const salt = randomBytes(FrontUserPasswordModel.BYTE_SIZE).toString(FrontUserPasswordModel.ENCODING);
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