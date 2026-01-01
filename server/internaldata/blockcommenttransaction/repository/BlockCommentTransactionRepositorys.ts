import { RepositoryType } from "../../../common/const/CommonConst";
import { BlockCommentTransactionRepositoryPostgres } from "./concrete/BlockCommentTransactionRepositoryPostgres";
import { BlockCommentTransactionRepositoryInterface } from "./interface/BlockCommentTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class BlockCommentTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, BlockCommentTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, BlockCommentTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new BlockCommentTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): BlockCommentTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}