import { RepositoryType } from "../../constant/CommonConst";
import { DeleteFavoriteSearchWordRepositoryPostgres } from "./concrete/DeleteFavoriteSearchWordRepositoryPostgres";
import { DeleteFavoriteSearchWordRepositoryInterface } from "./interface/DeleteFavoriteSearchWordRepositoryInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteFavoriteSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteFavoriteSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteFavoriteSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteFavoriteSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): DeleteFavoriteSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
