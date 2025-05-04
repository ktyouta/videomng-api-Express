// パスワード更新時のリクエストの型
export type UpdateFrontUserPasswordRequestType = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}