import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { RefreshSelectEntity } from '../entity/RefreshSelectEntity';
import { RefreshRepositoryInterface } from '../repository/interface/RefreshRepositoryInterface';


export class RefreshService {

    constructor(private readonly refreshRepositoryInterface: RefreshRepositoryInterface) { }

    /**
     * 認証
     * @param refreshTokenModel 
     */
    verify(refreshTokenModel: RefreshTokenModel) {

        const decode = refreshTokenModel.verify();
        const userId = Number(decode.sub);

        if (Number.isNaN(userId)) {
            throw new Error("ユーザーIDが不正です。");
        }

        return FrontUserIdModel.reConstruct(userId);
    }

    /**
     * ユーザー情報を取得
     * @param userIdModel 
     */
    async getUser(userIdModel: FrontUserIdModel) {

        const entity = new RefreshSelectEntity(userIdModel);

        const frontUserLoginList = await this.refreshRepositoryInterface.select(entity);

        return frontUserLoginList;
    }
}