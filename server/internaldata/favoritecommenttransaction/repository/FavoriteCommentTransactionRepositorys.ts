import { RepositoryType } from "../../../common/const/CommonConst";
import { FavoriteCommentTransactionRepositoryPostgres } from "./concrete/FavoriteCommentTransactionRepositoryPostgres";
import { FavoriteCommentTransactionRepositoryInterface } from "./interface/FavoriteCommentTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteCommentTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteCommentTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteCommentTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteCommentTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteCommentTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}