import { RepositoryType } from "../../common/const/CommonConst";
import { GetBlockCommentListRepositoryPostgres } from "./concrete/GetBlockCommentListRepositoryPostgres";
import { GetBlockCommentListRepositoryInterface } from "./interface/GetBlockCommentListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetBlockCommentListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetBlockCommentListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetBlockCommentListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetBlockCommentListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetBlockCommentListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}