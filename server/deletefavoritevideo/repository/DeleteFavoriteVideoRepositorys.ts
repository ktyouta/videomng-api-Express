import { RepositoryType } from "../../util/const/CommonConst";
import { DeleteFavoriteVideoRepositoryPostgres } from "./concrete/DeleteFavoriteVideoRepositoryPostgres";
import { DeleteFavoriteVideoInterface } from "./interface/DeleteFavoriteVideoInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteFavoriteVideoRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteFavoriteVideoInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteFavoriteVideoInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteFavoriteVideoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): DeleteFavoriteVideoInterface {
        return this.repositorys[repositoryType];
    }
}