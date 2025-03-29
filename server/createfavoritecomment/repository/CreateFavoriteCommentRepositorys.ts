import { RepositoryType } from "../../util/const/CommonConst";
import { CreateFavoriteCommentRepositoryPostgres } from "./concrete/CreateFavoriteCommentRepositoryPostgres";
import { CreateFavoriteCommentRepositoryInterface } from "./interface/CreateFavoriteCommentRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateFavoriteCommentRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateFavoriteCommentRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateFavoriteCommentRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateFavoriteCommentRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): CreateFavoriteCommentRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}