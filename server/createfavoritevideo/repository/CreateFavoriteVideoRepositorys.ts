import { RepositoryType } from "../../common/const/CommonConst";
import { CreateFavoriteVideoRepositoryPostgres } from "./concrete/CreateFavoriteVideoRepositoryPostgres";
import { CreateFavoriteVideoRepositoryInterface } from "./interface/CreateFavoriteVideoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateFavoriteVideoRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateFavoriteVideoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateFavoriteVideoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateFavoriteVideoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): CreateFavoriteVideoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}