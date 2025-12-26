import { RepositoryType } from "../../util/const/CommonConst";
import { RefreshRepositoryJson } from "./concrete/RefreshRepositoryJson";
import { RefreshRepositoryInterface } from "./interface/RefreshRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class RefreshRepositorys {


    private readonly repositorys: Record<RepositoryType, RefreshRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, RefreshRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new RefreshRepositoryJson())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): RefreshRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}