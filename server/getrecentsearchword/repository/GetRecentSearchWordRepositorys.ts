import { RepositoryType } from "../../constant/CommonConst";
import { GetRecentSearchWordRepositoryPostgres } from "./concrete/GetRecentSearchWordRepositoryPostgres";
import { GetRecentSearchWordRepositoryInterface } from "./interface/GetRecentSearchWordInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class GetRecentSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, GetRecentSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetRecentSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetRecentSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): GetRecentSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
