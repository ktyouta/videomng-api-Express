import { Request } from 'express';
import { FrontUserIdModel } from "../internaldata/common/properties/FrontUserIdModel";

export type AuthenticatedRequest = {
    frontUserIdModel: FrontUserIdModel;
} & Request;