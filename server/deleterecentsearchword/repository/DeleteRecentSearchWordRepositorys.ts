import { RepositoryType } from "../../constant/CommonConst";
import { DeleteRecentSearchWordRepositoryPostgres } from "./concrete/DeleteRecentSearchWordRepositoryPostgres";
import { DeleteRecentSearchWordRepositoryInterface } from "./interface/DeleteRecentSearchWordRepositoryInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteRecentSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteRecentSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteRecentSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteRecentSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): DeleteRecentSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
