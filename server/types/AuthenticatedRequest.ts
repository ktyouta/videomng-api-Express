import { Request } from 'express';
import { JsonWebTokenUserModel } from '../jsonwebtoken/model/JsonWebTokenUserModel';

export type AuthenticatedRequest = {
    jsonWebTokenUserModel: JsonWebTokenUserModel,
} & Request;