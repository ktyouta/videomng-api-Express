import { NextFunction, Request, Response } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { HeaderModel } from '../../header/model/HeaderModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_UNAUTHORIZED } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SelectEntity } from './entity/SelectEntity';
import { Repositorys } from './repository/Repositorys';

/**
 * トークン認証処理
 * @param req 
 * @param res 
 * @param next 
 */
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const repository = (new Repositorys()).get(RepositoryType.POSTGRESQL)

        const headerModel = new HeaderModel(req);
        const accessTokenModel = AccessTokenModel.get(headerModel);

        // トークン検証
        const decode = accessTokenModel.verify();
        const userIdModel = FrontUserIdModel.reConstruct(decode.sub);

        // ユーザー情報取得
        const entity = new SelectEntity(userIdModel);
        const userInfoList = await repository.select(entity);

        if (!userInfoList || userInfoList.length === 0) {
            throw Error(`認証エラー`);
        }

        const userInfo = userInfoList[0];

        req.userInfo = {
            frontUserIdModel: FrontUserIdModel.reConstruct(userInfo.userId),
            frontUserInfo: userInfo,
        };

        next();
    } catch (err) {
        ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証エラー`);
    }
};
