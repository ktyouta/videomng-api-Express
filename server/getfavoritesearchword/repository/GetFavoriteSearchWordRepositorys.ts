import { RepositoryType } from "../../constant/CommonConst";
import { GetFavoriteSearchWordRepositoryPostgres } from "./concrete/GetFavoriteSearchWordRepositoryPostgres";
import { GetFavoriteSearchWordRepositoryInterface } from "./interface/GetFavoriteSearchWordInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class GetFavoriteSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): GetFavoriteSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
