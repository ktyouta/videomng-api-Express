import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RefreshTokenModel } from "../../refreshtoken/model/RefreshTokenModel";
import { UserSelectEntity } from "../entity/UserSelectEntity";
import { FrontUserCheckAuthRepositoryInterface } from "../repository/interface/FrontUserCheckAuthRepositoryInterface";


export class FrontUserCheckAuthService {

    constructor(private readonly repository: FrontUserCheckAuthRepositoryInterface) { }

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

        const entity = new UserSelectEntity(userIdModel);

        const frontUserLoginList = await this.repository.select(entity);

        return frontUserLoginList;
    }
}