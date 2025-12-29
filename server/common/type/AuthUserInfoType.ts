// 認証用ユーザー情報
export type AuthUserInfoType = {
    accessToken: string,
    userInfo: {
        userId: number;
        userName: string,
        birthday: string,
    }
}