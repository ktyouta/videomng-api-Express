import { Request } from 'express';
import { FrontUserIdModel } from '../internaldata/common/properties/FrontUserIdModel';
import { FrontUserInfoType } from '../middleware/authMiddleware/type/FrontUserInfoType';

export type AuthenticatedRequest = {
    frontUserIdModel: FrontUserIdModel,
    frontUserInfo: FrontUserInfoType,
} & Request;