import { Request } from 'express';
import { FrontUserInfoType } from '../common/type/FrontUserInfoType';
import { FrontUserIdModel } from '../internaldata/common/properties/FrontUserIdModel';

export type AuthenticatedRequest = {
    userInfo: {
        frontUserIdModel: FrontUserIdModel,
        frontUserInfo: FrontUserInfoType,
    }
} & Request;