import { RepositoryType } from "../../common/const/CommonConst";
import { GetFavoriteVideoTagListRepositoryPostgres } from "./concrete/GetFavoriteVideoTagListRepositoryPostgres";
import { GetFavoriteVideoTagListRepositoryInterface } from "./interface/GetFavoriteVideoTagListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoTagListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoTagListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoTagListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoTagListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoTagListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}