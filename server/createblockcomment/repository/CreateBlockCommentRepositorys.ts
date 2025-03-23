import { RepositoryType } from "../../util/const/CommonConst";
import { CreateBlockCommentRepositoryPostgres } from "./concrete/CreateBlockCommentRepositoryPostgres";
import { CreateBlockCommentRepositoryInterface } from "./interface/CreateBlockCommentRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateBlockCommentRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateBlockCommentRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateBlockCommentRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateBlockCommentRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): CreateBlockCommentRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}