import { RepositoryType } from "../../common/const/CommonConst";
import { UpdateFavoriteVideoCustomRepositoryPostgres } from "./concrete/UpdateFavoriteVideoCustomRepositoryPostgres";
import { UpdateFavoriteVideoCustomRepositoryInterface } from "./interface/UpdateFavoriteVideoCustomRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class UpdateFavoriteVideoCustomRepositorys {


    private readonly repositorys: Record<RepositoryType, UpdateFavoriteVideoCustomRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UpdateFavoriteVideoCustomRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UpdateFavoriteVideoCustomRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UpdateFavoriteVideoCustomRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}