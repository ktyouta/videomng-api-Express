import { RepositoryType } from "../../constant/CommonConst";
import { DeleteSearchWordRepositoryPostgres } from "./concrete/DeleteSearchWordRepositoryPostgres";
import { DeleteSearchWordRepositoryInterface } from "./interface/DeleteSearchWordRepositoryInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): DeleteSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
