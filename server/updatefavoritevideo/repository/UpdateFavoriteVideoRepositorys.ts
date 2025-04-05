import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoRepositoryPostgres } from "./concrete/UpdateFavoriteVideoRepositoryPostgres";
import { UpdateFavoriteVideoRepositoryInterface } from "./interface/UpdateFavoriteVideoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class UpdateFavoriteVideoRepositorys {


    private readonly repositorys: Record<RepositoryType, UpdateFavoriteVideoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UpdateFavoriteVideoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UpdateFavoriteVideoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UpdateFavoriteVideoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}