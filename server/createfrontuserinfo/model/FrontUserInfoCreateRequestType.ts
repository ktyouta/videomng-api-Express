// ユーザー情報登録時のリクエストの型
export type FrontUserInfoCreateRequestType = {
    userName: string,
    userBirthday: string,
    password: string,
    confirmPassword: string,
}