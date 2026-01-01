import { RepositoryType } from "../../../common/const/CommonConst";
import { FavoriteVideoMemoTransactionRepositoryPostgres } from "./concrete/FavoriteVideoMemoTransactionRepositoryPostgres";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "./interface/FavoriteVideoMemoTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteVideoMemoTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteVideoMemoTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteVideoMemoTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteVideoMemoTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteVideoMemoTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}