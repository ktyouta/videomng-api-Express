import { JsonWebTokenUserModel } from '../../jsonwebtoken/Model/JsonWebTokenUserModel';

declare global {
    namespace Express {
        interface Request {
            jsonWebTokenUserModel?: JsonWebTokenUserModel,
        }
    }
}

export { };

