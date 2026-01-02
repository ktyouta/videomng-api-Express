import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { UserSelectEntity } from "../entity/UserSelectEntity";
import { FrontUserCheckAuthRepositoryInterface } from "../repository/interface/FrontUserCheckAuthRepositoryInterface";


export class FrontUserCheckAuthService {

    constructor(private readonly repository: FrontUserCheckAuthRepositoryInterface) { }

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