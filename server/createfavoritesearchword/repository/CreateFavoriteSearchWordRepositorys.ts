import { RepositoryType } from "../../constant/CommonConst";
import { CreateFavoriteSearchWordRepositoryPostgres } from "./concrete/CreateFavoriteSearchWordRepositoryPostgres";
import { CreateFavoriteSearchWordRepositoryInterface } from "./interface/CreateFavoriteSearchWordInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateFavoriteSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateFavoriteSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateFavoriteSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateFavoriteSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): CreateFavoriteSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
