import { RepositoryType } from "../../../util/const/CommonConst";
import { FavoriteVideoTransactionRepositoryPostgres } from "./concrete/FavoriteVideoTransactionRepositoryPostgres";
import { FavoriteVideoTransactionRepositoryInterface } from "./interface/FavoriteVideoTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteVideoTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteVideoTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteVideoTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteVideoTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteVideoTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}