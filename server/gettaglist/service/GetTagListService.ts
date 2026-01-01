import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { GetTagListSelectEntity } from "../entity/GetTagListSelectEntity";
import { GetTagListRepositorys } from "../repository/GetTagListRepositorys";
import { GetTagListRepositoryInterface } from "../repository/interface/GetTagListRepositoryInterface";


export class GetTagListService {

    /**
     * 永続ロジック用オブジェクトを取得
     */
    public getGetTagListRepository(): GetTagListRepositoryInterface {
        return (new GetTagListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * タグ取得
     */
    public async getTagList(getGetTagListRepository: GetTagListRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,) {

        // タグ取得用Entity
        const getTagListSelectEntity = new GetTagListSelectEntity(frontUserIdModel);

        // タグ取得
        const tagList = await getGetTagListRepository.selectTag(getTagListSelectEntity);

        return tagList;
    }
}