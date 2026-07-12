import { Request } from 'express';
import { FrontUserIdModel } from '../internaldata/common/properties/FrontUserIdModel';
import { FrontUserInfoType } from './FrontUserInfoType';

export type AuthenticatedRequest = {
    userInfo: {
        frontUserIdModel: FrontUserIdModel,
        frontUserInfo: FrontUserInfoType,
    }
} & Request;