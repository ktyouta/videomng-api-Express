export enum ApiEndopoint {
    FRONT_USER_INFO = "/frontuserinfo/v1/volumes",
    FRONT_USER_LOGIN = "/frontuserlogin/v1/volumes",
    FRONT_USER_LOGOUT = "/frontuserlogout/v1/volumes",
    FRONT_USER_CHECK_AUTH = "/frontusercheckauth/v1/volumes",
    VIDEO_INFO = "/videoinfo/v1/volumes",
    VIDEO_INFO_ID = "/videoinfo/v1/volumes/:id",
    VIDEO_COMMENT_ID = "/videocomment/v1/volumes/:id",
    FAVORITE_VIDEO = "/favoritevideo/v1/volumes",
    FAVORITE_VIDEO_ID = "/favoritevideo/v1/volumes/:id",
    FAVORITE_VIDEO_MEMO = "/favoritevideomemo/v1/volumes",
    FAVORITE_VIDEO_MEMO_ID = "/favoritevideomemo/v1/volumes/:id",
}