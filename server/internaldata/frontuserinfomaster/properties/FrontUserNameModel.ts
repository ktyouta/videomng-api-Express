export class FrontUserNameModel {

    private _frontUserName: string;

    constructor(userName: string) {

        this._frontUserName = userName;
    }

    public get frontUserName() {
        return this._frontUserName;
    }

    /**
     * ユーザー名の同一チェック
     * @param userNameModel 
     * @returns 
     */
    public checkUsernameDuplicate(userNameModel: FrontUserNameModel) {

        return this._frontUserName === userNameModel._frontUserName;
    }
}