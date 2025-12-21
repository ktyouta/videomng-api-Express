import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';

declare global {
    namespace Express {
        interface Request {
            frontUserIdModel?: FrontUserIdModel;
        }
    }
}

export { };
