import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { RefreshSelectEntity } from '../entity/RefreshSelectEntity';
import { RefreshRepositoryInterface } from '../repository/interface/RefreshRepositoryInterface';


export class RefreshService {

    constructor(private readonly refreshRepositoryInterface: RefreshRepositoryInterface) { }

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