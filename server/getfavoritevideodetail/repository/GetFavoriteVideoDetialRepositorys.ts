import { RepositoryType } from "../../common/const/CommonConst";
import { GetFavoriteVideoDetialRepositoryPostgres } from "./concrete/GetFavoriteVideoDetialRepositoryPostgres";
import { GetFavoriteVideoDetialRepositoryInterface } from "./interface/GetFavoriteVideoDetialRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoDetialRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoDetialRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoDetialRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoDetialRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoDetialRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}